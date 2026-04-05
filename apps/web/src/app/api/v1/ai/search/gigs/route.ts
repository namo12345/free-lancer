import { NextRequest } from "next/server";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { searchGigs } from "@/lib/ai/vector-store";
import { withAuth } from "@/app/api/_lib/with-auth";

export const POST = withAuth(
  async (req: NextRequest, _context, _user) => {
    const { query, category, limit } = await req.json();

    const queryEmbedding = await generateEmbedding(query);
    const results = await searchGigs({
      queryEmbedding,
      limit: limit || 10,
      category,
    });

    return Response.json({
      results,
      queryUnderstanding: `Searching for: ${query}`,
    });
  },
  { rateLimitMax: 10, rateLimitWindowMs: 60_000 }
);
