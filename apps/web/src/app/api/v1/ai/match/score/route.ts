import { NextRequest } from "next/server";
import { computeMatchScore } from "@/lib/ai/matching";
import { withAuth } from "@/app/api/_lib/with-auth";

export const POST = withAuth(
  async (req: NextRequest, _context, _user) => {
    const body = await req.json();
    const result = await computeMatchScore({
      gigDescription: body.gigDescription,
      gigSkills: body.gigSkills,
      freelancerBio: body.freelancerBio,
      freelancerSkills: body.freelancerSkills,
    });

    return Response.json(result);
  },
  { rateLimitMax: 10, rateLimitWindowMs: 60_000 }
);
