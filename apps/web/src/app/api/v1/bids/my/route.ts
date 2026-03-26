import { NextRequest } from "next/server";
import { prisma } from "@hiresense/db";
import { getAuthUser, jsonError } from "../../../_lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const bids = await prisma.bid.findMany({
    where: { freelancerId: user.id },
    include: { gig: { select: { id: true, title: true, category: true, budgetMin: true, budgetMax: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(bids);
}
