"use server";

import { prisma } from "@baseedwork/db";
import { createClient } from "@/lib/supabase/server";
import { updateFreelancerProfileSchema, updateEmployerProfileSchema } from "@baseedwork/shared";
import type { UpdateFreelancerProfileInput, UpdateEmployerProfileInput } from "@baseedwork/shared";

export async function createUserRecord(role: "FREELANCER" | "EMPLOYER") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (existing) return existing;

  const dbUser = await prisma.user.create({
    data: {
      supabaseId: user.id,
      email: user.email || "",
      phone: user.phone || null,
      role,
    },
  });

  // Create empty profile
  if (role === "FREELANCER") {
    await prisma.freelancerProfile.create({
      data: {
        userId: dbUser.id,
        displayName: user.email?.split("@")[0] || "Freelancer",
      },
    });
  } else {
    await prisma.employerProfile.create({
      data: {
        userId: dbUser.id,
        displayName: user.email?.split("@")[0] || "Employer",
      },
    });
  }

  return dbUser;
}

export async function updateFreelancerProfile(input: UpdateFreelancerProfileInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const validated = updateFreelancerProfileSchema.parse(input);

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { freelancerProfile: true },
  });
  if (!dbUser?.freelancerProfile) throw new Error("Profile not found");

  const { skillIds, ...profileData } = validated;

  const profile = await prisma.freelancerProfile.update({
    where: { id: dbUser.freelancerProfile.id },
    data: {
      ...profileData,
      hourlyRate: profileData.hourlyRate || undefined,
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

  const validated = updateEmployerProfileSchema.parse(input);

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { employerProfile: true },
  });
  if (!dbUser?.employerProfile) throw new Error("Profile not found");

  await prisma.employerProfile.update({
    where: { id: dbUser.employerProfile.id },
    data: validated,
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
