import { NextRequest } from "next/server";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { searchGigs } from "@/lib/ai/vector-store";

export async function POST(req: NextRequest) {
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
}
