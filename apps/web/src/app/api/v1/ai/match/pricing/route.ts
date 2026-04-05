import { NextRequest } from "next/server";
import { suggestPricing } from "@/lib/ai/matching";
import { withAuth } from "@/app/api/_lib/with-auth";

export const POST = withAuth(
  async (req: NextRequest, _context, _user) => {
    const { description, skills, budgetType } = await req.json();
    const result = await suggestPricing(description, skills || [], budgetType);
    return Response.json(result);
  },
  { rateLimitMax: 10, rateLimitWindowMs: 60_000 }
);
