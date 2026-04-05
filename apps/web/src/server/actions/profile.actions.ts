"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";
import { updateFreelancerProfileSchema, updateEmployerProfileSchema } from "@hiresense/shared";
import type { UpdateFreelancerProfileInput, UpdateEmployerProfileInput } from "@hiresense/shared";

function normalizeOptionalString(value: string | null | undefined) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function createUserRecord(role: "FREELANCER" | "EMPLOYER") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const email = user.email || "";
  const phone = user.phone || null;
  const fallbackName = email.split("@")[0] || (role === "FREELANCER" ? "Freelancer" : "Employer");

  const dbUser = await prisma.user.upsert({
    where: { supabaseId: user.id },
    update: {
      email,
      phone,
      role,
    },
    create: {
      supabaseId: user.id,
      email,
      phone,
      role,
    },
    include: {
      freelancerProfile: true,
      employerProfile: true,
    },
  });

  if (role === "FREELANCER" && !dbUser.freelancerProfile) {
    await prisma.freelancerProfile.create({
      data: {
        userId: dbUser.id,
        displayName: fallbackName,
      },
    });
  }

  if (role === "EMPLOYER" && !dbUser.employerProfile) {
    await prisma.employerProfile.create({
      data: {
        userId: dbUser.id,
        displayName: fallbackName,
      },
    });
  }

  return { success: true, role };
}

export async function updateFreelancerProfile(input: UpdateFreelancerProfileInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = updateFreelancerProfileSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid freelancer profile");
  }
  const validated = parsed.data;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { freelancerProfile: true },
  });
  if (!dbUser || dbUser.role !== "FREELANCER") throw new Error("Only freelancers can edit this profile");

  const { skillIds, ...profileData } = validated;
  const normalizedData = {
    ...profileData,
    hourlyRate: profileData.hourlyRate || undefined,
    githubUrl: normalizeOptionalString(profileData.githubUrl),
    behanceUrl: normalizeOptionalString(profileData.behanceUrl),
    dribbbleUrl: normalizeOptionalString(profileData.dribbbleUrl),
    linkedinUrl: normalizeOptionalString(profileData.linkedinUrl),
    upiId: normalizeOptionalString(profileData.upiId),
    bankAccountNumber: normalizeOptionalString(profileData.bankAccountNumber),
    bankIfsc: normalizeOptionalString(profileData.bankIfsc),
    bankName: normalizeOptionalString(profileData.bankName),
  };

  const profile = await prisma.freelancerProfile.upsert({
    where: { userId: dbUser.id },
    update: normalizedData,
    create: {
      userId: dbUser.id,
      displayName: normalizedData.displayName,
      headline: normalizedData.headline,
      bio: normalizedData.bio,
      avatarUrl: null,
      hourlyRate: normalizedData.hourlyRate,
      currency: "INR",
      city: normalizedData.city,
      state: normalizedData.state,
      isRemote: normalizedData.isRemote,
      githubUrl: normalizedData.githubUrl,
      behanceUrl: normalizedData.behanceUrl,
      dribbbleUrl: normalizedData.dribbbleUrl,
      linkedinUrl: normalizedData.linkedinUrl,
      upiId: normalizedData.upiId,
      bankAccountNumber: normalizedData.bankAccountNumber,
      bankIfsc: normalizedData.bankIfsc,
      bankName: normalizedData.bankName,
      aiPersonalityTags: [],
    },
  });

  // Update skills if provided
  if (skillIds) {
    await prisma.freelancerSkill.deleteMany({ where: { freelancerId: profile.id } });
    if (skillIds.length > 0) {
      await prisma.freelancerSkill.createMany({
        data: skillIds.map((skillId) => ({ freelancerId: profile.id, skillId })),
      });
    }
  }

  return { success: true };
}

export async function updateEmployerProfile(input: UpdateEmployerProfileInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = updateEmployerProfileSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid employer profile");
  }
  const validated = parsed.data;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { employerProfile: true },
  });
  if (!dbUser || dbUser.role !== "EMPLOYER") throw new Error("Only employers can edit this profile");

  await prisma.employerProfile.upsert({
    where: { userId: dbUser.id },
    update: {
      ...validated,
      website: normalizeOptionalString(validated.website),
    },
    create: {
      userId: dbUser.id,
      displayName: validated.displayName,
      companyName: validated.companyName,
      bio: validated.bio,
      avatarUrl: null,
      website: normalizeOptionalString(validated.website),
      industry: validated.industry,
      city: validated.city,
      state: validated.state,
    },
  });

  return { success: true };
}

export async function getMyProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      freelancerProfile: {
        include: {
          skills: { include: { skill: true } },
          portfolioItems: true,
          badges: true,
        },
      },
      employerProfile: true,
    },
  });
}

export async function getMyUserRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });

  return dbUser?.role ?? null;
}
