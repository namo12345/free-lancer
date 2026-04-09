import { PrismaClient } from "../../../apps/web/generated/client";

const prisma = new PrismaClient();

// ─── Skills catalog ────────────────────────────────────────────────────────────
const skills = [
  { name: "React", slug: "react", category: "Web Development" },
  { name: "Next.js", slug: "nextjs", category: "Web Development" },
  { name: "Vue.js", slug: "vuejs", category: "Web Development" },
  { name: "Angular", slug: "angular", category: "Web Development" },
  { name: "Node.js", slug: "nodejs", category: "Web Development" },
  { name: "Express.js", slug: "expressjs", category: "Web Development" },
  { name: "TypeScript", slug: "typescript", category: "Web Development" },
  { name: "JavaScript", slug: "javascript", category: "Web Development" },
  { name: "HTML/CSS", slug: "html-css", category: "Web Development" },
  { name: "Tailwind CSS", slug: "tailwind-css", category: "Web Development" },
  { name: "PHP", slug: "php", category: "Web Development" },
  { name: "Laravel", slug: "laravel", category: "Web Development" },
  { name: "Django", slug: "django", category: "Web Development" },
  { name: "FastAPI", slug: "fastapi", category: "Web Development" },
  { name: "Ruby on Rails", slug: "ruby-on-rails", category: "Web Development" },
  { name: "WordPress", slug: "wordpress", category: "Web Development" },
  { name: "GraphQL", slug: "graphql", category: "Web Development" },
  { name: "React Native", slug: "react-native", category: "Mobile Development" },
  { name: "Flutter", slug: "flutter", category: "Mobile Development" },
  { name: "Swift", slug: "swift", category: "Mobile Development" },
  { name: "Kotlin", slug: "kotlin", category: "Mobile Development" },
  { name: "iOS Development", slug: "ios-development", category: "Mobile Development" },
  { name: "Android Development", slug: "android-development", category: "Mobile Development" },
  { name: "Figma", slug: "figma", category: "UI/UX Design" },
  { name: "Adobe XD", slug: "adobe-xd", category: "UI/UX Design" },
  { name: "Sketch", slug: "sketch", category: "UI/UX Design" },
  { name: "UI Design", slug: "ui-design", category: "UI/UX Design" },
  { name: "UX Research", slug: "ux-research", category: "UI/UX Design" },
  { name: "Wireframing", slug: "wireframing", category: "UI/UX Design" },
  { name: "Prototyping", slug: "prototyping", category: "UI/UX Design" },
  { name: "Adobe Photoshop", slug: "photoshop", category: "Graphic Design" },
  { name: "Adobe Illustrator", slug: "illustrator", category: "Graphic Design" },
  { name: "Logo Design", slug: "logo-design", category: "Graphic Design" },
  { name: "Brand Identity", slug: "brand-identity", category: "Graphic Design" },
  { name: "Canva", slug: "canva", category: "Graphic Design" },
  { name: "Blog Writing", slug: "blog-writing", category: "Content Writing" },
  { name: "Copywriting", slug: "copywriting", category: "Content Writing" },
  { name: "SEO Writing", slug: "seo-writing", category: "Content Writing" },
  { name: "Technical Writing", slug: "technical-writing", category: "Content Writing" },
  { name: "Content Strategy", slug: "content-strategy", category: "Content Writing" },
  { name: "Adobe Premiere Pro", slug: "premiere-pro", category: "Video Editing" },
  { name: "After Effects", slug: "after-effects", category: "Video Editing" },
  { name: "DaVinci Resolve", slug: "davinci-resolve", category: "Video Editing" },
  { name: "Video Production", slug: "video-production", category: "Video Editing" },
  { name: "Motion Graphics", slug: "motion-graphics", category: "Video Editing" },
  { name: "SEO", slug: "seo", category: "Digital Marketing" },
  { name: "Google Ads", slug: "google-ads", category: "Digital Marketing" },
  { name: "Facebook Ads", slug: "facebook-ads", category: "Digital Marketing" },
  { name: "Social Media Marketing", slug: "social-media-marketing", category: "Digital Marketing" },
  { name: "Email Marketing", slug: "email-marketing", category: "Digital Marketing" },
  { name: "Analytics", slug: "analytics", category: "Digital Marketing" },
  { name: "Python", slug: "python", category: "Data Science" },
  { name: "R", slug: "r-language", category: "Data Science" },
  { name: "SQL", slug: "sql", category: "Data Science" },
  { name: "Pandas", slug: "pandas", category: "Data Science" },
  { name: "Data Visualization", slug: "data-visualization", category: "Data Science" },
  { name: "Machine Learning", slug: "machine-learning", category: "Data Science" },
  { name: "Deep Learning", slug: "deep-learning", category: "Data Science" },
  { name: "NLP", slug: "nlp", category: "Data Science" },
  { name: "TensorFlow", slug: "tensorflow", category: "AI/ML" },
  { name: "PyTorch", slug: "pytorch", category: "AI/ML" },
  { name: "LangChain", slug: "langchain", category: "AI/ML" },
  { name: "OpenAI API", slug: "openai-api", category: "AI/ML" },
  { name: "Computer Vision", slug: "computer-vision", category: "AI/ML" },
  { name: "LLM Fine-tuning", slug: "llm-fine-tuning", category: "AI/ML" },
  { name: "Docker", slug: "docker", category: "DevOps" },
  { name: "Kubernetes", slug: "kubernetes", category: "DevOps" },
  { name: "AWS", slug: "aws", category: "DevOps" },
  { name: "GCP", slug: "gcp", category: "DevOps" },
  { name: "Azure", slug: "azure", category: "DevOps" },
  { name: "CI/CD", slug: "ci-cd", category: "DevOps" },
  { name: "Linux", slug: "linux", category: "DevOps" },
  { name: "Terraform", slug: "terraform", category: "DevOps" },
  { name: "Solidity", slug: "solidity", category: "Blockchain" },
  { name: "Web3.js", slug: "web3js", category: "Blockchain" },
  { name: "Smart Contracts", slug: "smart-contracts", category: "Blockchain" },
  { name: "DeFi", slug: "defi", category: "Blockchain" },
  { name: "PostgreSQL", slug: "postgresql", category: "Databases" },
  { name: "MongoDB", slug: "mongodb", category: "Databases" },
  { name: "MySQL", slug: "mysql", category: "Databases" },
  { name: "Redis", slug: "redis", category: "Databases" },
  { name: "Firebase", slug: "firebase", category: "Databases" },
  { name: "Supabase", slug: "supabase", category: "Databases" },
];

// ─── Embedding helper (silently skips if pgvector not set up) ────────────────
async function trySetEmbedding(table: string, id: string, text: string) {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) return;
    const res = await fetch(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
      }
    );
    if (!res.ok) return;
    const raw = await res.json();
    const vec: number[] = Array.isArray(raw[0]) ? raw[0] : raw;
    await prisma.$executeRawUnsafe(
      `UPDATE "${table}" SET embedding = $1::vector WHERE id = $2`,
      `[${vec.join(",")}]`,
      id
    );
    console.log(`  ✓ Embedding set for ${table} ${id}`);
  } catch {
    // pgvector column may not exist yet — skip silently
  }
}

async function main() {
  // ── 1. Skills ────────────────────────────────────────────────────────────────
  console.log("Seeding skills...");
  for (const skill of skills) {
    await prisma.skill.upsert({ where: { slug: skill.slug }, update: {}, create: skill });
  }
  console.log(`  ✓ ${skills.length} skills`);

  // Fetch skill IDs we'll reference later
  const getSkill = async (slug: string) => prisma.skill.findUnique({ where: { slug } });

  // ── 2. Demo users ─────────────────────────────────────────────────────────────
  console.log("Seeding users...");

  // ── Freelancer: Arjun Sharma ──────────────────────────────────────────────
  const freelancerUser = await prisma.user.upsert({
    where: { supabaseId: "static-freelancer-user" },
    update: { role: "FREELANCER" },
    create: { supabaseId: "static-freelancer-user", email: "freelancer@hiresense.in", role: "FREELANCER" },
  });

  const freelancerProfile = await prisma.freelancerProfile.upsert({
    where: { userId: freelancerUser.id },
    update: {},
    create: {
      userId: freelancerUser.id,
      displayName: "Arjun Sharma",
      headline: "Full-Stack Developer | React, Next.js & Node.js Expert",
      bio: "5+ years building scalable web applications for Indian startups and global SaaS companies. I specialize in React, Next.js, TypeScript, and Node.js. Delivered 50+ projects on time with 98% client satisfaction. Ex-Flipkart engineer now working independently. I write clean, well-tested code and love solving complex product challenges.",
      hourlyRate: 2500,
      currency: "INR",
      city: "Bangalore",
      state: "Karnataka",
      isRemote: true,
      githubUrl: "https://github.com/arjunsharma-dev",
      linkedinUrl: "https://linkedin.com/in/arjun-sharma-fullstack",
      upiId: "arjun@okicici",
      totalEarnings: 450000,
      completedGigs: 23,
      avgRating: 4.8,
      responseTime: 2,
      aiPersonalityTags: ["reliable", "communicative", "detail-oriented", "fast-learner"],
      aiSkillScore: 92,
    },
  });
  console.log("  ✓ Freelancer: Arjun Sharma");

  // Skills for Arjun
  // proficiency is Int: 1=Beginner 2=Intermediate 3=Advanced 4=Expert
  const arjunSkills = [
    { slug: "react", years: 5, prof: 4 },
    { slug: "nextjs", years: 4, prof: 4 },
    { slug: "typescript", years: 4, prof: 3 },
    { slug: "nodejs", years: 5, prof: 4 },
    { slug: "postgresql", years: 3, prof: 3 },
    { slug: "docker", years: 2, prof: 2 },
    { slug: "aws", years: 2, prof: 2 },
    { slug: "tailwind-css", years: 3, prof: 4 },
    { slug: "graphql", years: 2, prof: 3 },
    { slug: "redis", years: 2, prof: 2 },
  ];

  for (const s of arjunSkills) {
    const skill = await getSkill(s.slug);
    if (!skill) continue;
    await prisma.freelancerSkill.upsert({
      where: { freelancerId_skillId: { freelancerId: freelancerProfile.id, skillId: skill.id } },
      update: {},
      create: { freelancerId: freelancerProfile.id, skillId: skill.id, yearsExp: s.years, proficiency: s.prof as number },
    });
  }

  // Portfolio for Arjun
  const portfolioItems = [
    {
      title: "IndiaCart – Multi-vendor E-commerce Platform",
      description: "Built a full-stack multi-vendor marketplace handling 10K+ daily orders. Tech: Next.js, Node.js, PostgreSQL, Redis, Stripe. Reduced page load by 60% with ISR and edge caching.",
      projectUrl: "https://indiacart.example.com",
    },
    {
      title: "HealthTrack – Patient Management SaaS",
      description: "Healthcare platform for 50+ clinics across India. Real-time appointment scheduling, EMR, billing integration with Razorpay. React Native mobile app with 4.7★ on Play Store.",
      projectUrl: "https://healthtrack.example.com",
    },
    {
      title: "EduLearn – LMS for Regional Languages",
      description: "Online learning platform supporting Hindi, Tamil, and Telugu content. 15K+ students enrolled. Built live video streaming with HLS, AI quiz generation, and certificate issuance.",
      projectUrl: "https://edulearn.example.com",
    },
    {
      title: "FinDash – Investment Portfolio Tracker",
      description: "Real-time stock and mutual fund tracker with NSE/BSE data feeds. Custom charting library, tax report generation, and WhatsApp alerts integration.",
      projectUrl: "https://findash.example.com",
    },
  ];

  for (const item of portfolioItems) {
    const exists = await prisma.portfolioItem.findFirst({
      where: { freelancerId: freelancerProfile.id, title: item.title },
    });
    if (!exists) {
      await prisma.portfolioItem.create({
        data: { ...item, freelancerId: freelancerProfile.id, source: "manual" },
      });
    }
  }

  // Skill badges for Arjun
  const badges = [
    { skillName: "React", badgeType: "TOP_RATED", score: 95 },
    { skillName: "Node.js", badgeType: "EXPERT", score: 91 },
    { skillName: "TypeScript", badgeType: "ADVANCED", score: 88 },
  ];
  for (const badge of badges) {
    const exists = await prisma.skillBadge.findFirst({
      where: { freelancerId: freelancerProfile.id, skillName: badge.skillName },
    });
    if (!exists) {
      await prisma.skillBadge.create({
        data: {
          freelancerId: freelancerProfile.id,
          skillName: badge.skillName,
          badgeType: badge.badgeType,
          score: badge.score,
          issuedAt: new Date(),
        },
      });
    }
  }

  // FreelancerDNA for Arjun (AI analysis)
  await prisma.freelancerDna.upsert({
    where: { freelancerId: freelancerProfile.id },
    update: {},
    create: {
      freelancerId: freelancerProfile.id,
      hardSkills: { React: 95, "Next.js": 92, "Node.js": 90, TypeScript: 88, PostgreSQL: 82, Docker: 72 },
      softSkills: ["Clear Communicator", "Deadline-oriented", "Problem Solver", "Self-starter", "Collaborative"],
      workPatterns: { preferredHours: "morning", avgResponseTime: "2h", revisionRate: 0.12, repeatClientRate: 0.45 },
      qualityScore: 0.92,
      aiSummary: "Arjun is an exceptionally reliable full-stack developer with deep React and Node.js expertise. His portfolio shows a consistent pattern of delivering complex, high-traffic applications on time. Clients praise his proactive communication and his ability to translate vague requirements into production-ready code. Particularly strong for SaaS and marketplace projects.",
      contentHash: "arjun_v1",
      lastAnalyzedAt: new Date(),
    },
  });

  // ── Employer: Priya Menon / TechVenture Solutions ────────────────────────
  const employerUser = await prisma.user.upsert({
    where: { supabaseId: "static-employer-user" },
    update: { role: "EMPLOYER" },
    create: { supabaseId: "static-employer-user", email: "employer@hiresense.in", role: "EMPLOYER" },
  });

  const employerProfile = await prisma.employerProfile.upsert({
    where: { userId: employerUser.id },
    update: {},
    create: {
      userId: employerUser.id,
      companyName: "TechVenture Solutions",
      displayName: "Priya Menon",
      bio: "We're a Mumbai-based product studio building India's next generation of SaaS tools. We hire top freelance talent for fast-moving digital transformation projects. We believe in long-term partnerships, clear briefs, and paying on time.",
      industry: "Technology",
      city: "Mumbai",
      state: "Maharashtra",
      website: "https://techventure.example.com",
      totalSpent: 320000,
      gigsPosted: 8,
      avgRating: 4.6,
    },
  });
  console.log("  ✓ Employer: Priya Menon (TechVenture Solutions)");

  // ── Extra freelancer 1: Neha Kapoor (UI/UX) ─────────────────────────────
  const nehaUser = await prisma.user.upsert({
    where: { supabaseId: "extra-freelancer-neha" },
    update: {},
    create: { supabaseId: "extra-freelancer-neha", email: "neha@hiresense.in", role: "FREELANCER" },
  });
  const nehaProfile = await prisma.freelancerProfile.upsert({
    where: { userId: nehaUser.id },
    update: {},
    create: {
      userId: nehaUser.id,
      displayName: "Neha Kapoor",
      headline: "Senior UI/UX Designer | Figma Expert | Design Systems",
      bio: "Award-winning UI/UX designer with 6 years crafting delightful digital products. I've designed for 30+ startups including unicorns. Specialise in SaaS dashboards, mobile apps, and design systems. Trained at NID Ahmedabad. My designs have won 3 Awwwards and a Red Dot commendation.",
      hourlyRate: 2000,
      city: "Pune",
      state: "Maharashtra",
      isRemote: true,
      linkedinUrl: "https://linkedin.com/in/neha-kapoor-ux",
      behanceUrl: "https://behance.net/nehakapoor",
      totalEarnings: 380000,
      completedGigs: 31,
      avgRating: 4.9,
      aiPersonalityTags: ["creative", "user-empathy", "systematic", "presentation-skills"],
      aiSkillScore: 96,
    },
  });

  for (const s of ["figma", "ui-design", "ux-research", "wireframing", "prototyping", "adobe-xd"]) {
    const skill = await getSkill(s);
    if (!skill) continue;
    await prisma.freelancerSkill.upsert({
      where: { freelancerId_skillId: { freelancerId: nehaProfile.id, skillId: skill.id } },
      update: {},
      create: { freelancerId: nehaProfile.id, skillId: skill.id, yearsExp: 5, proficiency: 4 },
    });
  }

  await prisma.freelancerDna.upsert({
    where: { freelancerId: nehaProfile.id },
    update: {},
    create: {
      freelancerId: nehaProfile.id,
      hardSkills: { Figma: 98, "UI Design": 96, "UX Research": 90, "Adobe XD": 85, Prototyping: 92 },
      softSkills: ["Empathetic", "Presentation Pro", "Iterative Thinker", "Pixel-perfect", "Stakeholder-savvy"],
      workPatterns: { preferredHours: "flexible", avgResponseTime: "1h", revisionRate: 0.08, repeatClientRate: 0.62 },
      qualityScore: 0.96,
      aiSummary: "Neha is one of the top UI/UX designers on the platform. Her portfolio demonstrates exceptional craft across mobile and web. She consistently delivers high-fidelity prototypes with thorough user research backing. Ideal for B2B SaaS, consumer apps, and brand-heavy design work.",
      contentHash: "neha_v1",
      lastAnalyzedAt: new Date(),
    },
  });
  console.log("  ✓ Extra freelancer: Neha Kapoor (UI/UX)");

  // ── Extra freelancer 2: Rahul Kumar (Data Science / AI) ─────────────────
  const rahulUser = await prisma.user.upsert({
    where: { supabaseId: "extra-freelancer-rahul" },
    update: {},
    create: { supabaseId: "extra-freelancer-rahul", email: "rahul@hiresense.in", role: "FREELANCER" },
  });
  const rahulProfile = await prisma.freelancerProfile.upsert({
    where: { userId: rahulUser.id },
    update: {},
    create: {
      userId: rahulUser.id,
      displayName: "Rahul Kumar",
      headline: "Data Scientist & ML Engineer | Python · TensorFlow · LangChain",
      bio: "IIT Delhi alumnus with 4 years in data science and AI. I build ML pipelines, recommendation systems, NLP models, and LLM-powered applications. Former Swiggy DS team. Published research in demand forecasting. I can take your data from raw CSVs to production-grade models with proper MLOps.",
      hourlyRate: 3000,
      city: "Hyderabad",
      state: "Telangana",
      isRemote: true,
      githubUrl: "https://github.com/rahul-kumar-ds",
      linkedinUrl: "https://linkedin.com/in/rahul-kumar-ml",
      totalEarnings: 290000,
      completedGigs: 15,
      avgRating: 4.7,
      aiPersonalityTags: ["analytical", "research-driven", "precise", "documentation-focused"],
      aiSkillScore: 89,
    },
  });

  for (const s of ["python", "machine-learning", "deep-learning", "tensorflow", "nlp", "langchain", "sql", "pandas"]) {
    const skill = await getSkill(s);
    if (!skill) continue;
    await prisma.freelancerSkill.upsert({
      where: { freelancerId_skillId: { freelancerId: rahulProfile.id, skillId: skill.id } },
      update: {},
      create: { freelancerId: rahulProfile.id, skillId: skill.id, yearsExp: 4, proficiency: 3 },
    });
  }

  await prisma.freelancerDna.upsert({
    where: { freelancerId: rahulProfile.id },
    update: {},
    create: {
      freelancerId: rahulProfile.id,
      hardSkills: { Python: 94, "Machine Learning": 89, TensorFlow: 85, NLP: 82, LangChain: 78, SQL: 88 },
      softSkills: ["Research-driven", "Data Storyteller", "Methodical", "Clear Documentation", "Self-managing"],
      workPatterns: { preferredHours: "evening", avgResponseTime: "3h", revisionRate: 0.10, repeatClientRate: 0.40 },
      qualityScore: 0.88,
      aiSummary: "Rahul brings rigorous academic thinking to practical AI/ML problems. His IIT background combined with industry experience at Swiggy makes him a strong choice for demand forecasting, recommendation engines, and LLM application development. Particularly good at explaining complex models to non-technical stakeholders.",
      contentHash: "rahul_v1",
      lastAnalyzedAt: new Date(),
    },
  });
  console.log("  ✓ Extra freelancer: Rahul Kumar (Data Science)");

  // ── 3. Gigs posted by Priya ──────────────────────────────────────────────
  console.log("Seeding gigs...");

  const gigData = [
    {
      title: "Build AI-Powered E-commerce Platform with Next.js & Node.js",
      description: "We need a senior full-stack developer to build a modern multi-vendor e-commerce platform for the Indian market. The platform must support 100K+ SKUs, integrate Razorpay & UPI payments, have an AI-powered recommendation engine, and support multilingual content (Hindi, Tamil, Telugu). Tech stack: Next.js 14 App Router, Node.js microservices, PostgreSQL with pgvector, Redis for caching. Must be mobile-first and achieve 90+ Lighthouse score. Timeline: 8 weeks.",
      category: "Web Development",
      budgetMin: 80000,
      budgetMax: 150000,
      status: "OPEN",
      experienceLevel: "EXPERT",
      duration: "8 weeks",
      isRemote: true,
      skillSlugs: ["nextjs", "nodejs", "postgresql", "react", "typescript", "redis"],
    },
    {
      title: "React Analytics Dashboard for SaaS Product",
      description: "Looking for a React specialist to build an interactive analytics dashboard for our B2B SaaS platform. The dashboard needs real-time charts (Recharts/Victory), custom date range filters, CSV/PDF export, role-based access control, and dark mode support. We have Figma designs ready. The backend APIs (REST + GraphQL) are already built. This is pure frontend work. Need pixel-perfect Tailwind CSS implementation.",
      category: "Web Development",
      budgetMin: 35000,
      budgetMax: 55000,
      status: "OPEN",
      experienceLevel: "ADVANCED",
      duration: "3 weeks",
      isRemote: true,
      skillSlugs: ["react", "typescript", "tailwind-css", "graphql"],
    },
    {
      title: "Node.js REST API Development for Mobile App Backend",
      description: "We're building a hyperlocal delivery app and need a Node.js developer to build the backend API. Scope: user authentication (JWT + OTP), location-based services with PostGIS, order management, real-time tracking via Socket.io, Firebase push notifications, and admin panel APIs. Must include comprehensive Swagger documentation and unit tests with >80% coverage. Deploy on AWS EC2 with PM2.",
      category: "Web Development",
      budgetMin: 40000,
      budgetMax: 65000,
      status: "IN_PROGRESS",
      experienceLevel: "ADVANCED",
      duration: "5 weeks",
      isRemote: true,
      skillSlugs: ["nodejs", "postgresql", "docker", "aws"],
    },
    {
      title: "Python ML Model for E-commerce Demand Forecasting",
      description: "Our e-commerce platform needs a demand forecasting system to optimize inventory. We have 2 years of historical order data (5M+ rows). Looking for an ML engineer to: perform EDA and feature engineering, train and compare LSTM, Prophet, and XGBoost models, build a FastAPI inference service, create a monitoring dashboard for model drift, and document the entire pipeline. Must achieve MAPE < 12% on test set.",
      category: "Data Science",
      budgetMin: 60000,
      budgetMax: 100000,
      status: "OPEN",
      experienceLevel: "EXPERT",
      duration: "6 weeks",
      isRemote: true,
      skillSlugs: ["python", "machine-learning", "deep-learning", "fastapi", "pandas"],
    },
    {
      title: "UI/UX Design for B2B SaaS Dashboard (Figma)",
      description: "We need a senior UI/UX designer to redesign our customer dashboard from scratch. The current UI is cluttered and has poor usability scores. Deliverables: user research synthesis report, information architecture, full Figma component library (design system), 40+ screen designs, interactive prototype, and handoff documentation for developers. Must follow WCAG 2.1 AA accessibility standards.",
      category: "UI/UX Design",
      budgetMin: 45000,
      budgetMax: 70000,
      status: "OPEN",
      experienceLevel: "EXPERT",
      duration: "4 weeks",
      isRemote: true,
      skillSlugs: ["figma", "ui-design", "ux-research", "prototyping"],
    },
    {
      title: "DevOps: AWS Infrastructure & CI/CD Pipeline Setup",
      description: "Our startup needs to move from manual deployments to a proper DevOps setup. Scope: containerize existing Node.js and Python services with Docker, set up Kubernetes on AWS EKS, implement GitHub Actions CI/CD pipelines with staging and production environments, configure CloudWatch monitoring and alerting, set up RDS PostgreSQL with read replicas, and implement auto-scaling. Must include runbooks and documentation.",
      category: "DevOps",
      budgetMin: 50000,
      budgetMax: 80000,
      status: "OPEN",
      experienceLevel: "ADVANCED",
      duration: "3 weeks",
      isRemote: true,
      skillSlugs: ["docker", "kubernetes", "aws", "ci-cd", "terraform", "linux"],
    },
  ] as const;

  const createdGigs: { id: string; title: string }[] = [];
  for (const gig of gigData) {
    const { skillSlugs, ...gigFields } = gig;
    let existing = await prisma.gig.findFirst({ where: { posterId: employerUser.id, title: gig.title } });
    if (!existing) {
      existing = await prisma.gig.create({
        data: { ...gigFields, posterId: employerUser.id, city: "Mumbai", state: "Maharashtra" },
      });
    }
    createdGigs.push({ id: existing.id, title: existing.title });

    // Attach skills
    for (const slug of skillSlugs) {
      const skill = await getSkill(slug);
      if (!skill) continue;
      await prisma.gigSkill.upsert({
        where: { gigId_skillId: { gigId: existing.id, skillId: skill.id } },
        update: {},
        create: { gigId: existing.id, skillId: skill.id },
      });
    }
  }
  console.log(`  ✓ ${createdGigs.length} gigs`);

  // The "IN_PROGRESS" gig is index 2 (Node.js API)
  const inProgressGig = createdGigs[2];

  // ── 4. Bids from Arjun ───────────────────────────────────────────────────
  console.log("Seeding bids...");

  // Bid on gig 1 (E-commerce) - PENDING
  const bid1 = await prisma.bid.upsert({
    where: { gigId_freelancerId: { gigId: createdGigs[0].id, freelancerId: freelancerUser.id } },
    update: {},
    create: {
      gigId: createdGigs[0].id,
      freelancerId: freelancerUser.id,
      amount: 110000,
      currency: "INR",
      deliveryDays: 56,
      coverLetter: "Hi Priya, I've built 3 large-scale e-commerce platforms in the past 2 years, including a multi-vendor marketplace that now handles ₹2 crore in GMV daily. I'm very familiar with Next.js App Router, Razorpay integration, and multilingual content systems. I'd love to discuss your specific requirements and share relevant portfolio links. Available for a call this week.",
      status: "PENDING",
      matchScore: 88,
      aiRationale: "Strong skills match: React, Next.js, Node.js, PostgreSQL all present. E-commerce experience directly relevant. Proposed amount within budget range.",
    },
  });

  // Bid on gig 3 (Node.js API) - ACCEPTED
  const bid2 = await prisma.bid.upsert({
    where: { gigId_freelancerId: { gigId: inProgressGig.id, freelancerId: freelancerUser.id } },
    update: {},
    create: {
      gigId: inProgressGig.id,
      freelancerId: freelancerUser.id,
      amount: 50000,
      currency: "INR",
      deliveryDays: 35,
      coverLetter: "I have extensive Node.js experience including real-time systems with Socket.io and location-based services. I've integrated Firebase push notifications for 2 previous delivery apps. Happy to share code samples. I can start immediately and deliver comprehensive Swagger docs and test coverage as required.",
      status: "ACCEPTED",
      matchScore: 94,
      aiRationale: "Excellent match: Node.js, PostgreSQL, Docker, AWS skills align perfectly. Real-time and location experience directly relevant. Competitive pricing.",
    },
  });

  // Neha bids on the UI/UX gig
  await prisma.bid.upsert({
    where: { gigId_freelancerId: { gigId: createdGigs[4].id, freelancerId: nehaUser.id } },
    update: {},
    create: {
      gigId: createdGigs[4].id,
      freelancerId: nehaUser.id,
      amount: 60000,
      currency: "INR",
      deliveryDays: 28,
      coverLetter: "I've redesigned 4 B2B SaaS dashboards in the past 18 months with measurable UX improvements (average 35% reduction in task completion time). I follow a rigorous user research process and deliver complete design systems. My work on FinTech dashboard won an Awwwards Site of the Day. Sharing a similar project case study for reference.",
      status: "PENDING",
      matchScore: 97,
      aiRationale: "Perfect skills match for UI/UX work. Portfolio demonstrates direct B2B SaaS dashboard experience. Price competitive and within budget.",
    },
  });

  // Rahul bids on the ML gig
  await prisma.bid.upsert({
    where: { gigId_freelancerId: { gigId: createdGigs[3].id, freelancerId: rahulUser.id } },
    update: {},
    create: {
      gigId: createdGigs[3].id,
      freelancerId: rahulUser.id,
      amount: 75000,
      currency: "INR",
      deliveryDays: 42,
      coverLetter: "Demand forecasting is my primary area of expertise. At Swiggy, I built the order volume forecasting system that improved inventory planning by 28%. I've worked with similar dataset sizes (10M+ rows) and have published a paper on hybrid LSTM-XGBoost models for retail forecasting. Can guarantee MAPE < 10% based on the data description provided.",
      status: "PENDING",
      matchScore: 96,
      aiRationale: "Exceptional match: all required ML skills present. Industry experience at Swiggy directly relevant. Research background adds credibility for complex forecasting.",
    },
  });
  console.log("  ✓ 4 bids");

  // ── 5. Milestones for IN_PROGRESS gig ───────────────────────────────────
  console.log("Seeding milestones...");

  const milestoneData = [
    { title: "API Architecture & Database Design", description: "Define API contract, ERD, database schema with PostGIS, set up project structure, Docker dev environment.", amount: 15000, orderIndex: 1, status: "APPROVED" as const },
    { title: "Core CRUD Endpoints & Auth", description: "User registration with OTP, JWT auth, location-based service endpoints, order management APIs with proper validation.", amount: 15000, orderIndex: 2, status: "SUBMITTED" as const },
    { title: "Real-time & Notifications", description: "Socket.io integration for live order tracking, Firebase push notifications, WebSocket connection management.", amount: 12000, orderIndex: 3, status: "IN_PROGRESS" as const },
    { title: "Testing, Docs & Deployment", description: "80%+ unit test coverage, Swagger documentation for all 40+ endpoints, AWS EC2 deployment with PM2 and Nginx.", amount: 8000, orderIndex: 4, status: "PENDING" as const },
  ];

  const createdMilestones: { id: string; title: string; amount: number }[] = [];
  for (const ms of milestoneData) {
    let existing = await prisma.milestone.findFirst({ where: { gigId: inProgressGig.id, title: ms.title } });
    if (!existing) {
      existing = await prisma.milestone.create({
        data: {
          ...ms,
          gigId: inProgressGig.id,
          submittedAt: ms.status === "SUBMITTED" || ms.status === "APPROVED" ? new Date(Date.now() - 7 * 86400000) : null,
          approvedAt: ms.status === "APPROVED" ? new Date(Date.now() - 3 * 86400000) : null,
        },
      });
    }
    createdMilestones.push({ id: existing.id, title: existing.title, amount: existing.amount });
  }
  console.log("  ✓ 4 milestones");

  // ── 6. Invoice for approved milestone ───────────────────────────────────
  console.log("Seeding invoices...");
  const approvedMs = createdMilestones[0];

  let invoice = await prisma.invoice.findFirst({ where: { gigId: inProgressGig.id } });
  if (!invoice) {
    invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2025-0042",
        gigId: inProgressGig.id,
        employerId: employerUser.id,
        freelancerId: freelancerUser.id,
        subtotal: approvedMs.amount,
        platformFee: approvedMs.amount * 0.05,
        gst: approvedMs.amount * 0.18,
        totalAmount: approvedMs.amount * 1.23,
        currency: "INR",
        status: "PAID",
        dueDate: new Date(Date.now() - 5 * 86400000),
        paidAt: new Date(Date.now() - 2 * 86400000),
        notes: "Payment for Phase 1: API Architecture & Database Design. UPI transfer completed.",
        items: {
          create: [
            {
              milestoneId: approvedMs.id,
              description: "API Architecture & Database Design",
              quantity: 1,
              rate: approvedMs.amount,
              amount: approvedMs.amount,
            },
          ],
        },
      },
    });
  }
  console.log("  ✓ Invoice INV-2025-0042 (PAID)");

  // ── 7. Conversation & Messages ───────────────────────────────────────────
  console.log("Seeding messages...");

  let conversation = await prisma.conversation.findFirst({
    where: { gigId: inProgressGig.id },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        participantIds: [employerUser.id, freelancerUser.id],
        gigId: inProgressGig.id,
        lastMessageAt: new Date(),
      },
    });
  }

  const messages = [
    { senderId: employerUser.id, receiverId: freelancerUser.id, content: "Hi Arjun! I've reviewed your bid and I'm impressed. Your cover letter mentioned real-time tracking experience — can you share examples?", daysAgo: 14 },
    { senderId: freelancerUser.id, receiverId: employerUser.id, content: "Hi Priya! Thanks for reaching out. I built the live tracking system for QuickDrop (hyperlocal delivery startup) — Socket.io with <500ms latency. I'll send a Loom walkthrough. When would you like to start?", daysAgo: 13 },
    { senderId: employerUser.id, receiverId: freelancerUser.id, content: "Great! Loom looks perfect. I'm going to accept your bid. We'll use the milestone structure you proposed. First payment released on milestone 1 approval.", daysAgo: 12 },
    { senderId: freelancerUser.id, receiverId: employerUser.id, content: "Excellent! I've submitted the architecture document and ERD. Please review Milestone 1 — I've also set up the Docker environment so you can test locally with docker-compose up.", daysAgo: 8 },
    { senderId: employerUser.id, receiverId: freelancerUser.id, content: "Milestone 1 approved! The schema looks solid and PostGIS integration is clean. Invoice raised — payment sent via UPI. Keep up the great work!", daysAgo: 3 },
    { senderId: freelancerUser.id, receiverId: employerUser.id, content: "Thank you! Milestone 2 (Core CRUD + Auth) is submitted for review. All endpoints documented in Swagger. Test credentials are in the README.", daysAgo: 2 },
    { senderId: employerUser.id, receiverId: freelancerUser.id, content: "Testing Milestone 2 now. Quick question — the OTP flow, are we using Firebase Auth or a custom SMS provider? Want to confirm before we go to staging.", daysAgo: 1 },
    { senderId: freelancerUser.id, receiverId: employerUser.id, content: "Using MSG91 for SMS OTP (better rates than Firebase for India, ₹0.15/SMS). Firebase is only for push notifications. I'll add a note to the docs. Testing guide is ready.", daysAgo: 0 },
  ];

  const existingMessages = await prisma.message.findMany({ where: { conversationId: conversation.id } });
  if (existingMessages.length === 0) {
    for (const msg of messages) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          isRead: msg.daysAgo > 0,
          createdAt: new Date(Date.now() - msg.daysAgo * 86400000),
        },
      });
    }
  }
  console.log("  ✓ 8 messages in conversation");

  // ── 8. Reviews ───────────────────────────────────────────────────────────
  console.log("Seeding reviews...");

  // Priya reviews Arjun (for a previously completed gig — use the inProgressGig)
  let priyaReview = await prisma.review.findFirst({ where: { authorId: employerUser.id, gigId: inProgressGig.id } });
  if (!priyaReview) {
    await prisma.review.create({
      data: {
        authorId: employerUser.id,
        targetId: freelancerUser.id,
        gigId: inProgressGig.id,
        rating: 5,
        communicationRating: 5,
        qualityRating: 5,
        timelinessRating: 5,
        valueRating: 4,
        comment: "Arjun is exceptional. The API architecture he designed is clean, well-documented, and scales beautifully. He proactively identified a bottleneck in our location queries and optimized it without being asked. Real-time tracking works flawlessly. Will definitely hire again for our next sprint.",
        isPublic: true,
      },
    });
  }

  // Arjun reviews Priya
  let arjunReview = await prisma.review.findFirst({ where: { authorId: freelancerUser.id, gigId: inProgressGig.id } });
  if (!arjunReview) {
    await prisma.review.create({
      data: {
        authorId: freelancerUser.id,
        targetId: employerUser.id,
        gigId: inProgressGig.id,
        rating: 5,
        communicationRating: 5,
        qualityRating: 5,
        timelinessRating: 5,
        valueRating: 5,
        comment: "Priya is a dream client. Crystal-clear requirements, detailed Figma specs, and she actually tests the deliverables before approval. Payments were made within 24 hours of milestone approval. I hope to work on her next project too.",
        isPublic: true,
      },
    });
  }
  console.log("  ✓ 2 reviews");

  // ── 9. Notifications ─────────────────────────────────────────────────────
  console.log("Seeding notifications...");

  const notifData = [
    // For Arjun
    { userId: freelancerUser.id, type: "BID_ACCEPTED", title: "Your bid was accepted!", body: `Priya Menon accepted your bid for "${inProgressGig.title}". Check your dashboard to get started.`, isRead: true },
    { userId: freelancerUser.id, type: "MILESTONE_APPROVED", title: "Milestone approved — Payment incoming!", body: "Milestone 1: API Architecture & Database Design has been approved. Invoice INV-2025-0042 has been raised. Payment in 24-48 hours.", isRead: true },
    { userId: freelancerUser.id, type: "MESSAGE", title: "New message from Priya Menon", body: "Testing Milestone 2 now. Quick question — the OTP flow, are we using Firebase Auth or a custom SMS provider?", isRead: false },
    { userId: freelancerUser.id, type: "BID_PENDING", title: "Bid submitted successfully", body: `Your bid of ₹1,10,000 on "${createdGigs[0].title}" is under review.`, isRead: true },
    // For Priya
    { userId: employerUser.id, type: "NEW_BID", title: "New bid received!", body: `Arjun Sharma bid ₹1,10,000 on "${createdGigs[0].title}". AI Match Score: 88/100.`, isRead: false },
    { userId: employerUser.id, type: "MILESTONE_SUBMITTED", title: "Milestone submitted for review", body: `Arjun Sharma submitted Milestone 2: Core CRUD Endpoints & Auth for "${inProgressGig.title}". Please review.`, isRead: false },
    { userId: employerUser.id, type: "NEW_BID", title: "New bid from Neha Kapoor", body: `Neha Kapoor bid ₹60,000 on "${createdGigs[4].title}". AI Match Score: 97/100.`, isRead: true },
    { userId: employerUser.id, type: "NEW_BID", title: "New bid from Rahul Kumar", body: `Rahul Kumar bid ₹75,000 on "${createdGigs[3].title}". AI Match Score: 96/100.`, isRead: true },
  ];

  for (const notif of notifData) {
    const exists = await prisma.notification.findFirst({ where: { userId: notif.userId, type: notif.type, title: notif.title } });
    if (!exists) {
      await prisma.notification.create({ data: notif });
    }
  }
  console.log("  ✓ 8 notifications");

  // ── 10. SkillDemand (market data for AI pricing) ─────────────────────────
  console.log("Seeding skill demand data...");

  const demandData = [
    { skill: "React", demandScore: 94, jobCount30d: 1240, avgRateInr: 2800, growthRate: 0.18 },
    { skill: "Next.js", demandScore: 91, jobCount30d: 890, avgRateInr: 3000, growthRate: 0.31 },
    { skill: "Node.js", demandScore: 89, jobCount30d: 1050, avgRateInr: 2600, growthRate: 0.15 },
    { skill: "TypeScript", demandScore: 87, jobCount30d: 780, avgRateInr: 2900, growthRate: 0.22 },
    { skill: "Python", demandScore: 92, jobCount30d: 1380, avgRateInr: 2700, growthRate: 0.25 },
    { skill: "Machine Learning", demandScore: 85, jobCount30d: 540, avgRateInr: 3500, growthRate: 0.35 },
    { skill: "Figma", demandScore: 88, jobCount30d: 620, avgRateInr: 2200, growthRate: 0.20 },
    { skill: "Docker", demandScore: 82, jobCount30d: 480, avgRateInr: 2500, growthRate: 0.28 },
    { skill: "Flutter", demandScore: 79, jobCount30d: 420, avgRateInr: 2400, growthRate: 0.40 },
    { skill: "LangChain", demandScore: 76, jobCount30d: 180, avgRateInr: 4000, growthRate: 0.85 },
  ];

  for (const d of demandData) {
    await prisma.skillDemand.upsert({
      where: { skill: d.skill },
      update: d,
      create: d,
    });
  }
  console.log("  ✓ Skill demand data");

  // ── 11. Generate embeddings (optional, requires HuggingFace API) ─────────
  console.log("Attempting embedding generation (requires HUGGINGFACE_API_KEY)...");
  const embedTasks = [
    { table: "FreelancerProfile", id: freelancerProfile.id, text: `${freelancerProfile.displayName} ${freelancerProfile.headline} ${freelancerProfile.bio} React Next.js Node.js TypeScript PostgreSQL` },
    { table: "FreelancerProfile", id: nehaProfile.id, text: `${nehaProfile.displayName} ${nehaProfile.headline} ${nehaProfile.bio} Figma UI Design UX Research` },
    { table: "FreelancerProfile", id: rahulProfile.id, text: `${rahulProfile.displayName} ${rahulProfile.headline} ${rahulProfile.bio} Python Machine Learning TensorFlow NLP` },
  ];
  for (const task of embedTasks) {
    await trySetEmbedding(task.table, task.id, task.text);
  }
  for (const gig of createdGigs) {
    const full = gigData.find((g) => g.title === gig.title);
    if (full) {
      await trySetEmbedding("Gig", gig.id, `${full.title} ${full.description} ${full.category}`);
    }
  }

  console.log("\n✅ Seed complete!");
  console.log("\nDemo Login Credentials:");
  console.log("  👨‍💻 Freelancer: username=freelancer  password=freelancer123");
  console.log("  🏢 Employer:    username=employer   password=employer123");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
