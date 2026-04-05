"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toString" in value) {
    return Number(value.toString());
  }
  return 0;
}

async function getCurrentDbUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { supabaseId: user.id } });
}

export async function getFreelancerMilestones() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return [];

  const gigs = await prisma.gig.findMany({
    where: {
      status: { in: ["IN_PROGRESS", "COMPLETED"] },
      bids: { some: { freelancerId: dbUser.id, status: "ACCEPTED" } },
    },
    include: {
      milestones: {
        include: { deliverables: true },
        orderBy: { orderIndex: "asc" },
      },
      poster: { select: { email: true, employerProfile: { select: { companyName: true } } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return gigs.map((gig) => ({
    id: gig.id,
    title: gig.title,
    status: gig.status,
    employerName: gig.poster.employerProfile?.companyName || gig.poster.email,
    budget: toNumber(gig.budgetMax),
    milestones: gig.milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      amount: toNumber(m.amount),
      status: m.status,
      orderIndex: m.orderIndex,
      submittedAt: m.submittedAt?.toISOString() || null,
      approvedAt: m.approvedAt?.toISOString() || null,
      deliverables: m.deliverables.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        note: d.note,
      })),
    })),
  }));
}

export async function getEmployerMilestones() {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) return [];

  const gigs = await prisma.gig.findMany({
    where: {
      posterId: dbUser.id,
      status: { in: ["IN_PROGRESS", "COMPLETED"] },
    },
    include: {
      milestones: {
        include: { deliverables: true },
        orderBy: { orderIndex: "asc" },
      },
      bids: {
        where: { status: "ACCEPTED" },
        include: { freelancer: { select: { email: true, freelancerProfile: { select: { displayName: true } } } } },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return gigs.map((gig) => ({
    id: gig.id,
    title: gig.title,
    status: gig.status,
    freelancerName: gig.bids[0]?.freelancer.freelancerProfile?.displayName || gig.bids[0]?.freelancer.email || "N/A",
    budget: toNumber(gig.budgetMax),
    milestones: gig.milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      amount: toNumber(m.amount),
      status: m.status,
      orderIndex: m.orderIndex,
      submittedAt: m.submittedAt?.toISOString() || null,
      approvedAt: m.approvedAt?.toISOString() || null,
      deliverables: m.deliverables.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        note: d.note,
      })),
    })),
  }));
}

export async function submitMilestone(milestoneId: string, note?: string) {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) throw new Error("Unauthorized");

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { gig: { include: { bids: { where: { status: "ACCEPTED" } } } } },
  });

  if (!milestone) throw new Error("Milestone not found");
  const acceptedBid = milestone.gig.bids[0];
  if (!acceptedBid || acceptedBid.freelancerId !== dbUser.id) {
    throw new Error("Not authorized");
  }

  if (note) {
    await prisma.milestoneDeliverable.create({
      data: {
        milestoneId,
        fileName: "submission-note.txt",
        fileUrl: "",
        fileSize: 0,
        note,
      },
    });
  }

  return prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });
}

export async function approveMilestone(milestoneId: string) {
  const dbUser = await getCurrentDbUser();
  if (!dbUser) throw new Error("Unauthorized");

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    include: { gig: true },
  });

  if (!milestone) throw new Error("Milestone not found");
  if (milestone.gig.posterId !== dbUser.id) throw new Error("Not authorized");

  const updated = await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "APPROVED", approvedAt: new Date() },
  });

  const allMilestones = await prisma.milestone.findMany({ where: { gigId: milestone.gigId } });
  const allApproved = allMilestones.every((m) => m.status === "APPROVED");

  if (allApproved) {
    await prisma.gig.update({ where: { id: milestone.gigId }, data: { status: "COMPLETED" } });
  }

  return { milestone: updated, gigCompleted: allApproved };
}
