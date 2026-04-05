import { getGigById } from "@/server/actions/gig.actions";
import { GigDetailClient } from "./client";
import { notFound } from "next/navigation";

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const gig = await getGigById(id);
  if (!gig) notFound();

  const gigData = {
    id: gig.id,
    title: gig.title,
    description: gig.description,
    category: gig.category,
    budgetMin: Number(gig.budgetMin),
    budgetMax: Number(gig.budgetMax),
    budgetType: gig.budgetType,
    experienceLevel: gig.experienceLevel,
    duration: gig.duration,
    deadline: gig.deadline?.toISOString() || null,
    isRemote: gig.isRemote,
    city: gig.city,
    skills: gig.skills.map((s) => s.skill.name),
    bidCount: gig.bids.length,
    viewCount: gig.viewCount,
    createdAt: gig.createdAt.toISOString(),
    poster: {
      displayName:
        gig.poster?.employerProfile?.displayName ||
        gig.poster?.email ||
        "Unknown",
      avgRating: gig.poster?.employerProfile?.avgRating || 0,
    },
    bids: gig.bids.map((b) => ({
      id: b.id,
      freelancerName:
        b.freelancer?.freelancerProfile?.displayName || "Anonymous",
      avgRating: b.freelancer?.freelancerProfile?.avgRating || 0,
      completedGigs: b.freelancer?.freelancerProfile?.completedGigs || 0,
      amount: Number(b.amount),
      deliveryDays: b.deliveryDays,
      matchScore: b.matchScore || 0,
      coverLetter: b.coverLetter,
    })),
  };

  return <GigDetailClient gig={gigData} />;
}
