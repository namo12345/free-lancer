import { NextRequest } from "next/server";
import { chatCompletion } from "@/lib/ai/llm";
import { withAuth } from "@/app/api/_lib/with-auth";

export const POST = withAuth(
  async (req: NextRequest, _context, _user) => {
    const { text } = await req.json();

    const prompt = `Extract technical and professional skills from this text.
Return a JSON array of skill names only. Max 10 skills.

Text: ${(text || "").slice(0, 1000)}

Respond with JSON ONLY: ["skill1", "skill2", ...]`;

    const response = await chatCompletion(
      [{ role: "user", content: prompt }],
      { temperature: 0.2, maxTokens: 200 }
    );

    try {
      const skills = JSON.parse(response);
      if (Array.isArray(skills)) {
        return Response.json({ skills: skills.slice(0, 10) });
      }
    } catch {
      // parse failed
    }

    return Response.json({ skills: [] });
  },
  { rateLimitMax: 10, rateLimitWindowMs: 60_000 }
);
