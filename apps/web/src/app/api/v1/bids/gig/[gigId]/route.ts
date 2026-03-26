import { NextRequest } from "next/server";
import { prisma } from "@hiresense/db";
import { getAuthUser, jsonError } from "../../../../_lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ gigId: string }> }) {
  const { gigId } = await params;
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig) return jsonError("Gig not found", 404);
  if (gig.posterId !== user.id) return jsonError("Not authorized", 403);

  const bids = await prisma.bid.findMany({
    where: { gigId },
    include: { freelancer: { include: { freelancerProfile: true } } },
    orderBy: { matchScore: "desc" },
  });

  return Response.json(bids);
}
