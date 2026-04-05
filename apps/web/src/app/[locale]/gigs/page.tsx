import { getGigs } from "@/server/actions/gig.actions";
import { BrowseGigsClient } from "./client";

export default async function BrowseGigsPage() {
  const { gigs } = await getGigs({ limit: 50 });

  const serializedGigs = gigs.map((gig) => ({
    id: gig.id,
    title: gig.title,
    description: gig.description,
    category: gig.category,
    budgetMin: Number(gig.budgetMin),
    budgetMax: Number(gig.budgetMax),
    budgetType: gig.budgetType,
    isRemote: gig.isRemote,
    city: gig.city,
    skills: gig.skills.map((s) => s.skill.name),
    bidCount: gig._count.bids,
    createdAt: gig.createdAt.toISOString(),
    poster: {
      displayName:
        gig.poster?.employerProfile?.displayName ||
        gig.poster?.email ||
        "Unknown",
    },
  }));

  return <BrowseGigsClient initialGigs={serializedGigs} />;
}
