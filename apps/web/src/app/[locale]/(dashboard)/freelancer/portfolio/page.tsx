import { getMyProfile } from "@/server/actions/profile.actions";
import { Sidebar } from "@/components/layout/sidebar";
import { PortfolioClient } from "./client";

export default async function FreelancerPortfolioPage() {
  const profile = await getMyProfile();

  const portfolioItems = (profile?.freelancerProfile?.portfolioItems ?? []).map(
    (item) => ({
      id: item.id,
      title: item.title,
      description: item.description ?? undefined,
      projectUrl: item.projectUrl ?? undefined,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
      source: item.source,
      sourceId: item.sourceId ?? undefined,
      metadata: item.metadata as
        | { stars?: number; forks?: number; language?: string }
        | undefined,
      createdAt: item.createdAt.toISOString(),
    })
  );

  // Extract GitHub username from the stored URL (e.g. "https://github.com/username")
  const githubUrl = profile?.freelancerProfile?.githubUrl ?? "";
  const githubUsername = githubUrl
    ? githubUrl.replace(/^https?:\/\/github\.com\//, "").replace(/\/+$/, "")
    : "";

  return (
    <>
      <Sidebar role="freelancer" />
      <main className="flex-1 p-6 space-y-6">
        <PortfolioClient
          initialItems={portfolioItems}
          githubUsername={githubUsername}
        />
      </main>
    </>
  );
}
