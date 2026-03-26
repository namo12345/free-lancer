"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(data: {
  targetId: string;
  gigId: string;
  rating: number;
  communicationRating?: number;
  qualityRating?: number;
  timelinessRating?: number;
  valueRating?: number;
  comment?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  // Verify gig is completed
  const gig = await prisma.gig.findUnique({ where: { id: data.gigId } });
  if (!gig || gig.status !== "COMPLETED") throw new Error("Can only review completed gigs");

  const review = await prisma.review.create({
    data: {
      authorId: dbUser.id,
      targetId: data.targetId,
      gigId: data.gigId,
      rating: data.rating,
      communicationRating: data.communicationRating,
      qualityRating: data.qualityRating,
      timelinessRating: data.timelinessRating,
      valueRating: data.valueRating,
      comment: data.comment,
    },
  });

  // Update target's average rating
  const allReviews = await prisma.review.findMany({ where: { targetId: data.targetId } });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  const targetUser = await prisma.user.findUnique({
    where: { id: data.targetId },
    include: { freelancerProfile: true, employerProfile: true },
  });

  if (targetUser?.freelancerProfile) {
    await prisma.freelancerProfile.update({
      where: { id: targetUser.freelancerProfile.id },
      data: { avgRating },
    });
  } else if (targetUser?.employerProfile) {
    await prisma.employerProfile.update({
      where: { id: targetUser.employerProfile.id },
      data: { avgRating },
    });
  }

  return { success: true, reviewId: review.id };
}

export async function getReviewsForUser(userId: string) {
  return prisma.review.findMany({
    where: { targetId: userId },
    include: {
      author: {
        select: {
          freelancerProfile: { select: { displayName: true, avatarUrl: true } },
          employerProfile: { select: { displayName: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function flagDispute(data: {
  gigId: string;
  reason: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  // Create a notification for admin
  await prisma.notification.create({
    data: {
      userId: dbUser.id,
      type: "dispute_flagged",
      title: "Dispute Flagged",
      body: `Dispute raised for gig: ${data.reason}`,
      data: { gigId: data.gigId, reason: data.reason, flaggedBy: dbUser.id },
    },
  });

  return { success: true };
}
