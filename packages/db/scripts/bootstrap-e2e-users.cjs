const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const ROOT_DIR = path.resolve(__dirname, "../../..");
const ENV_FILES = [".env", ".env.local"];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const parsed = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in parsed)) {
      parsed[key] = value;
    }
  }

  return parsed;
}

function loadEnv() {
  for (const fileName of ENV_FILES) {
    const envPath = path.join(ROOT_DIR, fileName);
    const parsed = parseEnvFile(envPath);
    for (const [key, value] of Object.entries(parsed)) {
      if (process.env[key] == null || process.env[key] === "") {
        process.env[key] = value;
      }
    }
  }
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function findOrCreateAuthUser(baseUrl, serviceRoleKey, email, password) {
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };

  let listRes;
  try {
    listRes = await fetch(
      `${baseUrl}/auth/v1/admin/users?per_page=200&page=1`,
      { headers }
    );
  } catch (error) {
    throw new Error(
      `Unable to reach Supabase auth at ${baseUrl}: ${
        error && typeof error === "object" && "cause" in error && error.cause
          ? `${error.cause.code || ""} ${error.cause.message || ""}`.trim()
          : error instanceof Error
            ? error.message
            : String(error)
      }`
    );
  }

  if (!listRes.ok) {
    throw new Error(`Failed to list Supabase users: ${await listRes.text()}`);
  }

  const listJson = await listRes.json();
  const existing = (listJson.users || []).find((user) => user.email === email);

  if (existing) {
    let updateRes;
    try {
      updateRes = await fetch(`${baseUrl}/auth/v1/admin/users/${existing.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ password, email_confirm: true }),
      });
    } catch (error) {
      throw new Error(
        `Unable to update Supabase auth user ${email}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }

    if (!updateRes.ok) {
      throw new Error(`Failed to update Supabase user ${email}: ${await updateRes.text()}`);
    }

    return existing;
  }

  let createRes;
  try {
    createRes = await fetch(`${baseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
  } catch (error) {
    throw new Error(
      `Unable to create Supabase auth user ${email}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  if (!createRes.ok) {
    throw new Error(`Failed to create Supabase user ${email}: ${await createRes.text()}`);
  }

  const createJson = await createRes.json();
  return createJson.user || createJson;
}

async function upsertSkill(prisma, skill) {
  return prisma.skill.upsert({
    where: { slug: skill.slug },
    update: { name: skill.name, category: skill.category },
    create: skill,
  });
}

async function resetGigSkills(prisma, gigId, skillIds) {
  await prisma.gigSkill.deleteMany({ where: { gigId } });
  if (skillIds.length > 0) {
    await prisma.gigSkill.createMany({
      data: skillIds.map((skillId) => ({ gigId, skillId })),
    });
  }
}

async function resetInvoiceItems(prisma, invoiceId, items) {
  await prisma.invoiceItem.deleteMany({ where: { invoiceId } });
  if (items.length > 0) {
    await prisma.invoiceItem.createMany({
      data: items.map((item) => ({ invoiceId, ...item })),
    });
  }
}

async function main() {
  loadEnv();

  const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");
  const password = process.env.E2E_TEST_PASSWORD || "Test123!234";
  const freelancerEmail =
    process.env.E2E_FREELANCER_EMAIL || "freelancer.e2e@baseedwork.local";
  const employerEmail =
    process.env.E2E_EMPLOYER_EMAIL || "employer.e2e@baseedwork.local";

  const prisma = new PrismaClient();

  try {
    const freelancerAuth = await findOrCreateAuthUser(
      supabaseUrl,
      serviceRoleKey,
      freelancerEmail,
      password
    );
    const employerAuth = await findOrCreateAuthUser(
      supabaseUrl,
      serviceRoleKey,
      employerEmail,
      password
    );

    const freelancerUser = await prisma.user.upsert({
      where: { supabaseId: freelancerAuth.id },
      update: {
        email: freelancerEmail,
        phone: null,
        role: "FREELANCER",
        preferredLang: "EN",
      },
      create: {
        supabaseId: freelancerAuth.id,
        email: freelancerEmail,
        phone: null,
        role: "FREELANCER",
        preferredLang: "EN",
      },
    });

    const employerUser = await prisma.user.upsert({
      where: { supabaseId: employerAuth.id },
      update: {
        email: employerEmail,
        phone: null,
        role: "EMPLOYER",
        preferredLang: "EN",
      },
      create: {
        supabaseId: employerAuth.id,
        email: employerEmail,
        phone: null,
        role: "EMPLOYER",
        preferredLang: "EN",
      },
    });

    const [react, nextjs, typescript, nodejs] = await Promise.all([
      upsertSkill(prisma, { name: "React", slug: "react", category: "Web Development" }),
      upsertSkill(prisma, { name: "Next.js", slug: "nextjs", category: "Web Development" }),
      upsertSkill(prisma, { name: "TypeScript", slug: "typescript", category: "Web Development" }),
      upsertSkill(prisma, { name: "Node.js", slug: "nodejs", category: "Web Development" }),
    ]);

    const freelancerProfile = await prisma.freelancerProfile.upsert({
      where: { userId: freelancerUser.id },
      update: {
        displayName: "E2E Freelancer",
        headline: "Full-stack developer",
        bio: "Seeded freelancer account for deterministic local validation.",
        avatarUrl: null,
        hourlyRate: 1500,
        currency: "INR",
        city: "Bangalore",
        state: "Karnataka",
        isRemote: true,
        githubUrl: "https://github.com/seeded-freelancer",
        linkedinUrl: "https://www.linkedin.com/in/seeded-freelancer",
        upiId: "freelancer@upi",
        bankName: "Seeded Bank",
        bankAccountNumber: "1234567890",
        bankIfsc: "SEED0000001",
        totalEarnings: 33540,
        completedGigs: 1,
        avgRating: 5,
        responseTime: 2,
      },
      create: {
        userId: freelancerUser.id,
        displayName: "E2E Freelancer",
        headline: "Full-stack developer",
        bio: "Seeded freelancer account for deterministic local validation.",
        avatarUrl: null,
        hourlyRate: 1500,
        currency: "INR",
        city: "Bangalore",
        state: "Karnataka",
        isRemote: true,
        githubUrl: "https://github.com/seeded-freelancer",
        linkedinUrl: "https://www.linkedin.com/in/seeded-freelancer",
        upiId: "freelancer@upi",
        bankName: "Seeded Bank",
        bankAccountNumber: "1234567890",
        bankIfsc: "SEED0000001",
        aiPersonalityTags: ["reliable", "responsive"],
        totalEarnings: 33540,
        completedGigs: 1,
        avgRating: 5,
        responseTime: 2,
      },
    });

    const employerProfile = await prisma.employerProfile.upsert({
      where: { userId: employerUser.id },
      update: {
        displayName: "E2E Employer",
        companyName: "Seeded Studio",
        bio: "Seeded employer account for deterministic local validation.",
        website: "https://example.com",
        industry: "Technology",
        city: "Bangalore",
        state: "Karnataka",
        totalSpent: 33540,
        gigsPosted: 2,
        avgRating: 5,
      },
      create: {
        userId: employerUser.id,
        displayName: "E2E Employer",
        companyName: "Seeded Studio",
        bio: "Seeded employer account for deterministic local validation.",
        website: "https://example.com",
        industry: "Technology",
        city: "Bangalore",
        state: "Karnataka",
        totalSpent: 33540,
        gigsPosted: 2,
        avgRating: 5,
      },
    });

    const openGigTitle = "E2E Website Build";
    const openGig = await prisma.gig.findFirst({
      where: { posterId: employerUser.id, title: openGigTitle },
    });

    const seededOpenGig = openGig
      ? await prisma.gig.update({
          where: { id: openGig.id },
          data: {
            description:
              "Build a responsive marketing website with a modern design system and reusable components.",
            category: "Web Development",
            subcategory: "Frontend",
            budgetMin: 15000,
            budgetMax: 30000,
            budgetType: "fixed",
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            duration: "2 weeks",
            experienceLevel: "Intermediate",
            city: "Bangalore",
            state: "Karnataka",
            isRemote: true,
            status: "OPEN",
            publishedAt: new Date(),
          },
        })
      : await prisma.gig.create({
          data: {
            posterId: employerUser.id,
            title: openGigTitle,
            description:
              "Build a responsive marketing website with a modern design system and reusable components.",
            category: "Web Development",
            subcategory: "Frontend",
            budgetMin: 15000,
            budgetMax: 30000,
            budgetType: "fixed",
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            duration: "2 weeks",
            experienceLevel: "Intermediate",
            city: "Bangalore",
            state: "Karnataka",
            isRemote: true,
            status: "OPEN",
            publishedAt: new Date(),
          },
        });

    await resetGigSkills(prisma, seededOpenGig.id, [react.id, nextjs.id, typescript.id]);

    await prisma.bid.deleteMany({
      where: { gigId: seededOpenGig.id, freelancerId: freelancerUser.id },
    });

    const invoiceGigTitle = "E2E Invoice Project";
    const invoiceGig = await prisma.gig.findFirst({
      where: { posterId: employerUser.id, title: invoiceGigTitle },
    });

    const seededInvoiceGig = invoiceGig
      ? await prisma.gig.update({
          where: { id: invoiceGig.id },
          data: {
            description:
              "Completed project used to verify invoice rendering, review display, and seeded dashboard data.",
            category: "Web Development",
            subcategory: "Backend",
            budgetMin: 20000,
            budgetMax: 40000,
            budgetType: "fixed",
            deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            duration: "3 weeks",
            experienceLevel: "Intermediate",
            city: "Bangalore",
            state: "Karnataka",
            isRemote: true,
            status: "COMPLETED",
            publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          },
        })
      : await prisma.gig.create({
          data: {
            posterId: employerUser.id,
            title: invoiceGigTitle,
            description:
              "Completed project used to verify invoice rendering, review display, and seeded dashboard data.",
            category: "Web Development",
            subcategory: "Backend",
            budgetMin: 20000,
            budgetMax: 40000,
            budgetType: "fixed",
            deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            duration: "3 weeks",
            experienceLevel: "Intermediate",
            city: "Bangalore",
            state: "Karnataka",
            isRemote: true,
            status: "COMPLETED",
            publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          },
        });

    await resetGigSkills(prisma, seededInvoiceGig.id, [nodejs.id, typescript.id]);

    const invoiceNumber = "BW-E2E-0001";
    const invoiceTotal = 33540;
    const invoice = await prisma.invoice.upsert({
      where: { invoiceNumber },
      update: {
        gigId: seededInvoiceGig.id,
        employerId: employerUser.id,
        freelancerId: freelancerUser.id,
        subtotal: 30000,
        platformFee: 3000,
        gst: 540,
        totalAmount: invoiceTotal,
        currency: "INR",
        status: "SENT",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        notes: "Seeded invoice for Playwright validation.",
      },
      create: {
        invoiceNumber,
        gigId: seededInvoiceGig.id,
        employerId: employerUser.id,
        freelancerId: freelancerUser.id,
        subtotal: 30000,
        platformFee: 3000,
        gst: 540,
        totalAmount: invoiceTotal,
        currency: "INR",
        status: "SENT",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        notes: "Seeded invoice for Playwright validation.",
      },
      include: { items: true },
    });

    await resetInvoiceItems(prisma, invoice.id, [
      {
        description: "Discovery and implementation",
        quantity: 1,
        rate: 30000,
        amount: 30000,
      },
    ]);

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        gigId: seededOpenGig.id,
        participantIds: { hasEvery: [employerUser.id, freelancerUser.id] },
      },
    });

    const conversation =
      existingConversation ||
      (await prisma.conversation.create({
        data: {
          participantIds: [employerUser.id, freelancerUser.id],
          gigId: seededOpenGig.id,
          lastMessageAt: new Date(),
        },
      }));

    const existingMessage = await prisma.message.findFirst({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "desc" },
    });

    if (!existingMessage) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: employerUser.id,
          receiverId: freelancerUser.id,
          content: "Seeded message for local validation.",
          attachmentUrl: null,
          isRead: false,
        },
      });
    }

    await prisma.freelancerSkill.deleteMany({ where: { freelancerId: freelancerProfile.id } });
    await prisma.freelancerSkill.createMany({
      data: [
        { freelancerId: freelancerProfile.id, skillId: react.id, yearsExp: 4, proficiency: 5 },
        { freelancerId: freelancerProfile.id, skillId: nextjs.id, yearsExp: 3, proficiency: 5 },
        { freelancerId: freelancerProfile.id, skillId: typescript.id, yearsExp: 4, proficiency: 5 },
      ],
    });

    const badge = await prisma.skillBadge.findFirst({
      where: {
        freelancerId: freelancerProfile.id,
        skillName: "GitHub verified",
        badgeType: "verification",
      },
    });

    if (!badge) {
      await prisma.skillBadge.create({
        data: {
          freelancerId: freelancerProfile.id,
          skillName: "GitHub verified",
          badgeType: "verification",
          score: 100,
        },
      });
    }

    const review = await prisma.review.findUnique({
      where: { authorId_gigId: { authorId: employerUser.id, gigId: seededInvoiceGig.id } },
    }).catch(() => null);

    if (review) {
      await prisma.review.update({
        where: { id: review.id },
        data: {
          targetId: freelancerUser.id,
          rating: 5,
          communicationRating: 5,
          qualityRating: 5,
          timelinessRating: 5,
          valueRating: 5,
          comment: "Seeded review for deterministic validation.",
          isPublic: true,
        },
      });
    } else {
      await prisma.review.create({
        data: {
          authorId: employerUser.id,
          targetId: freelancerUser.id,
          gigId: seededInvoiceGig.id,
          rating: 5,
          communicationRating: 5,
          qualityRating: 5,
          timelinessRating: 5,
          valueRating: 5,
          comment: "Seeded review for deterministic validation.",
          isPublic: true,
        },
      });
    }

    await prisma.freelancerProfile.update({
      where: { id: freelancerProfile.id },
      data: {
        totalEarnings: invoiceTotal,
        completedGigs: 1,
        avgRating: 5,
        responseTime: 2,
      },
    });

    await prisma.employerProfile.update({
      where: { id: employerProfile.id },
      data: {
        totalSpent: invoiceTotal,
        gigsPosted: 2,
        avgRating: 5,
      },
    });

    await prisma.notification.upsert({
      where: { id: "seeded-e2e-notification" },
      update: {
        userId: employerUser.id,
        type: "invoice_created",
        title: "Seeded invoice ready",
        body: "A deterministic invoice has been created for local validation.",
        data: { invoiceNumber, gigId: seededInvoiceGig.id },
        isRead: false,
      },
      create: {
        id: "seeded-e2e-notification",
        userId: employerUser.id,
        type: "invoice_created",
        title: "Seeded invoice ready",
        body: "A deterministic invoice has been created for local validation.",
        data: { invoiceNumber, gigId: seededInvoiceGig.id },
        isRead: false,
      },
    });

    console.log(
      JSON.stringify(
        {
          status: "ok",
          freelancerEmail,
          employerEmail,
          password,
          seeded: {
            openGig: seededOpenGig.title,
            invoiceGig: seededInvoiceGig.title,
            invoiceNumber: invoice.invoiceNumber,
            conversationId: conversation.id,
          },
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
