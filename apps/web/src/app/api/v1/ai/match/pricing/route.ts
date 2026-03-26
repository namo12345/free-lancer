import { NextRequest } from "next/server";
import { suggestPricing } from "@/lib/ai/matching";

export async function POST(req: NextRequest) {
  const { description, skills, budgetType } = await req.json();
  const result = await suggestPricing(description, skills || [], budgetType);
  return Response.json(result);
}
