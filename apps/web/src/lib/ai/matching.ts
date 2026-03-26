import { chatCompletion } from "./llm";

export async function computeMatchScore(params: {
  gigDescription: string;
  gigSkills: string[];
  freelancerBio: string;
  freelancerSkills: string[];
}): Promise<{ score: number; rationale: string }> {
  const prompt = `You are an AI matchmaking system for a freelancing platform.
Score the compatibility between this gig and freelancer from 0-100.

GIG:
Description: ${params.gigDescription.slice(0, 500)}
Required Skills: ${params.gigSkills.join(", ")}

FREELANCER:
Bio: ${params.freelancerBio.slice(0, 500)}
Skills: ${params.freelancerSkills.join(", ")}

Respond in JSON format ONLY:
{"score": <number 0-100>, "rationale": "<1-2 sentence explanation>"}`;

  const response = await chatCompletion(
    [{ role: "user", content: prompt }],
    { temperature: 0.3, maxTokens: 200 }
  );

  try {
    const result = JSON.parse(response);
    return {
      score: Math.min(100, Math.max(0, Number(result.score) || 50)),
      rationale: result.rationale || "Match score computed.",
    };
  } catch {
    return { score: 50, rationale: "Unable to compute precise match score." };
  }
}

export async function suggestPricing(
  description: string,
  skills: string[],
  budgetType: string = "fixed"
): Promise<{ low: number; fair: number; high: number; explanation: string }> {
  const prompt = `You are a pricing advisor for an Indian freelancing platform.
Suggest a fair price range in INR for this project.

Description: ${description.slice(0, 500)}
Skills: ${skills.join(", ")}
Type: ${budgetType}

Consider Indian market rates. Respond in JSON ONLY:
{"low": <number>, "fair": <number>, "high": <number>, "explanation": "<brief>"}`;

  const response = await chatCompletion(
    [{ role: "user", content: prompt }],
    { temperature: 0.3, maxTokens: 200 }
  );

  try {
    return JSON.parse(response);
  } catch {
    return { low: 5000, fair: 15000, high: 30000, explanation: "Default estimate." };
  }
}
