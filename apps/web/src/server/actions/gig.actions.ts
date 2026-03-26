"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";
import { createGigSchema, type CreateGigInput } from "@hiresense/shared";

export async function createGig(input: CreateGigInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const validated = createGigSchema.parse(input);

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });
  if (!dbUser || dbUser.role !== "EMPLOYER") throw new Error("Only employers can post gigs");

  const gig = await prisma.gig.create({
    data: {
      posterId: dbUser.id,
      title: validated.title,
      description: validated.description,
      category: validated.category,
      subcategory: validated.subcategory,
      budgetMin: validated.budgetMin,
      budgetMax: validated.budgetMax,
      budgetType: validated.budgetType,
      deadline: validated.deadline ? new Date(validated.deadline) : null,
      duration: validated.duration,
      experienceLevel: validated.experienceLevel,
      isRemote: validated.isRemote,
      city: validated.city,
      state: validated.state,
      status: "OPEN",
      publishedAt: new Date(),
      skills: {
        create: validated.skillIds.map((skillId) => ({ skillId })),
      },
    },
  });

  return { success: true, gigId: gig.id };
}

export async function getGigs(filters?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: "OPEN" };
  if (filters?.category) where.category = filters.category;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [gigs, total] = await Promise.all([
    prisma.gig.findMany({
      where,
      include: {
        skills: { include: { skill: true } },
        poster: { include: { employerProfile: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.gig.count({ where }),
  ]);

  return { gigs, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getGigById(id: string) {
  return prisma.gig.findUnique({
    where: { id },
    include: {
      skills: { include: { skill: true } },
      poster: { include: { employerProfile: true } },
      bids: {
        include: { freelancer: { include: { freelancerProfile: true } } },
        orderBy: { matchScore: "desc" },
      },
      milestones: { orderBy: { orderIndex: "asc" } },
    },
  });
}
