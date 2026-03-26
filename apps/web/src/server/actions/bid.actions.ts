"use server";

import { prisma } from "@baseedwork/db";
import { createClient } from "@/lib/supabase/server";
import { createBidSchema, type CreateBidInput } from "@baseedwork/shared";

export async function submitBid(input: CreateBidInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const validated = createBidSchema.parse(input);

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });
  if (!dbUser || dbUser.role !== "FREELANCER") throw new Error("Only freelancers can bid");

  // Check gig exists and is open
  const gig = await prisma.gig.findUnique({ where: { id: validated.gigId } });
  if (!gig || gig.status !== "OPEN") throw new Error("Gig not available");

  // Check for existing bid
  const existingBid = await prisma.bid.findUnique({
    where: { gigId_freelancerId: { gigId: validated.gigId, freelancerId: dbUser.id } },
  });
  if (existingBid) throw new Error("You already bid on this gig");

  // Create bid (AI match scoring would be called here via AI service)
  const bid = await prisma.bid.create({
    data: {
      gigId: validated.gigId,
      freelancerId: dbUser.id,
      amount: validated.amount,
      deliveryDays: validated.deliveryDays,
      coverLetter: validated.coverLetter,
      status: "PENDING",
    },
  });

  // Update gig bid count
  await prisma.gig.update({
    where: { id: validated.gigId },
    data: { bidCount: { increment: 1 } },
  });

  return { success: true, bidId: bid.id };
}

export async function acceptBid(bidId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { gig: true },
  });
  if (!bid) throw new Error("Bid not found");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser || bid.gig.posterId !== dbUser.id) throw new Error("Not authorized");

  // Accept this bid, reject others
  await prisma.$transaction([
    prisma.bid.update({ where: { id: bidId }, data: { status: "ACCEPTED" } }),
    prisma.bid.updateMany({
      where: { gigId: bid.gigId, id: { not: bidId } },
      data: { status: "REJECTED" },
    }),
    prisma.gig.update({
      where: { id: bid.gigId },
      data: { status: "IN_PROGRESS" },
    }),
  ]);

  return { success: true };
}
