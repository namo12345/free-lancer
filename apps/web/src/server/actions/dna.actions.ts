"use server";

import { prisma } from "@hiresense/db";
import { createClient } from "@/lib/supabase/server";

async function getCurrentFreelancer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      freelancerProfile: {
        include: { skills: { include: { skill: true } } },
      },
    },
  });
}

export async function getFreelancerDna() {
  const dbUser = await getCurrentFreelancer();
  if (!dbUser?.freelancerProfile) return null;

  const dna = await prisma.freelancerDna.findUnique({
    where: { freelancerId: dbUser.freelancerProfile.id },
  });

  return dna;
}

export async function generateFreelancerDna() {
  const dbUser = await getCurrentFreelancer();
  if (!dbUser?.freelancerProfile) throw new Error("Freelancer profile not found");

  const profile = dbUser.freelancerProfile;
  const skills = profile.skills.map((s) => s.skill.name);

  const prompt = `You are an AI career analyst for the HireSense India freelancing platform.

Analyze this freelancer profile and generate a FreelancerDNA report:
- Name: ${profile.displayName}
- Headline: ${profile.headline ?? "Not set"}
- Bio: ${profile.bio ?? "Not set"}
- Skills: ${skills.join(", ") || "None listed"}
- Hourly Rate: ₹${profile.hourlyRate ?? "Not set"}/hr
- Location: ${profile.city ?? "Unknown"}, ${profile.state ?? "India"}
- Completed Gigs: ${profile.completedGigs}
- Avg Rating: ${profile.avgRating ?? "No ratings yet"}

Respond with ONLY a valid JSON object (no markdown, no code blocks):
{
  "hardSkills": [{ "name": "React", "level": "expert", "marketDemand": "high" }],
  "softSkills": ["communication", "time management"],
  "workPatterns": { "preferredWorkStyle": "remote", "peakProductivityHours": "morning", "projectPreference": "long-term" },
  "qualityScore": 85,
  "aiSummary": "Two to three sentence summary of the freelancer's strengths and positioning in the Indian market."
}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  let parsed: {
    hardSkills: { name: string; level: string; marketDemand: string }[];
    softSkills: string[];
    workPatterns: Record<string, string>;
    qualityScore: number;
    aiSummary: string;
  };

  try {
    // Strip markdown code blocks if present
    const clean = content.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(clean);
  } catch {
    throw new Error("AI returned invalid JSON. Please try again.");
  }

  const dna = await prisma.freelancerDna.upsert({
    where: { freelancerId: profile.id },
    create: {
      freelancerId: profile.id,
      hardSkills: parsed.hardSkills,
      softSkills: parsed.softSkills,
      workPatterns: parsed.workPatterns,
      qualityScore: parsed.qualityScore,
      aiSummary: parsed.aiSummary,
      lastAnalyzedAt: new Date(),
    },
    update: {
      hardSkills: parsed.hardSkills,
      softSkills: parsed.softSkills,
      workPatterns: parsed.workPatterns,
      qualityScore: parsed.qualityScore,
      aiSummary: parsed.aiSummary,
      lastAnalyzedAt: new Date(),
    },
  });

  return dna;
}
