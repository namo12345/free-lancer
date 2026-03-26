import { NextRequest } from "next/server";
import { computeMatchScore } from "@/lib/ai/matching";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await computeMatchScore({
    gigDescription: body.gigDescription,
    gigSkills: body.gigSkills,
    freelancerBio: body.freelancerBio,
    freelancerSkills: body.freelancerSkills,
  });

  return Response.json(result);
}
