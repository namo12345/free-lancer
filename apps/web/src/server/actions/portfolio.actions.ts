"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

export async function syncGitHubPortfolio(githubUsername: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { freelancerProfile: true },
  });
  if (!dbUser?.freelancerProfile) throw new Error("Profile not found");

  // Fetch public repos from GitHub API (no auth needed for public repos)
  const response = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?sort=stars&per_page=10`,
    { headers: { Accept: "application/vnd.github.v3+json" } }
  );

  if (!response.ok) throw new Error("Failed to fetch GitHub repos");

  const repos: GitHubRepo[] = await response.json();

  // Upsert portfolio items
  for (const repo of repos) {
    await prisma.portfolioItem.upsert({
      where: {
        id: `gh-${dbUser.freelancerProfile.id}-${repo.name}`, // Pseudo-unique
      },
      update: {
        title: repo.name,
        description: repo.description,
        projectUrl: repo.html_url,
        metadata: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
        },
      },
      create: {
        freelancerId: dbUser.freelancerProfile.id,
        title: repo.name,
        description: repo.description,
        projectUrl: repo.html_url,
        source: "github",
        sourceId: repo.name,
        metadata: {
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
        },
      },
    });
  }

  // Update sync timestamp
  await prisma.freelancerProfile.update({
    where: { id: dbUser.freelancerProfile.id },
    data: { githubUrl: `https://github.com/${githubUsername}` },
  });

  return { synced: repos.length };
}

export async function addPortfolioItem(data: {
  title: string;
  description?: string;
  projectUrl?: string;
  thumbnailUrl?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: { freelancerProfile: true },
  });
  if (!dbUser?.freelancerProfile) throw new Error("Profile not found");

  return prisma.portfolioItem.create({
    data: {
      freelancerId: dbUser.freelancerProfile.id,
      title: data.title,
      description: data.description,
      projectUrl: data.projectUrl,
      thumbnailUrl: data.thumbnailUrl,
      source: "manual",
    },
  });
}

export async function deletePortfolioItem(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.portfolioItem.delete({ where: { id: itemId } });
  return { success: true };
}
