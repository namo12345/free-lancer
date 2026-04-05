import { NextRequest } from "next/server";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { searchFreelancers } from "@/lib/ai/vector-store";
import { withAuth } from "@/app/api/_lib/with-auth";

export const POST = withAuth(
  async (req: NextRequest, _context, _user) => {
    const { query, category, city, minRating, limit } = await req.json();

    const queryEmbedding = await generateEmbedding(query);
    const results = await searchFreelancers({
      queryEmbedding,
      limit: limit || 10,
      category,
      city,
      minRating,
    });

    return Response.json({
      results,
      queryUnderstanding: `Searching for: ${query}`,
    });
  },
  { rateLimitMax: 10, rateLimitWindowMs: 60_000 }
);
