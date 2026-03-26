import { NextRequest } from "next/server";
import { prisma } from "@hiresense/db";
import { getAuthUser, jsonError } from "../../_lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "FREELANCER") {
    return jsonError("Only freelancers can bid", 403);
  }

  const { gigId, amount, deliveryDays, coverLetter } = await req.json();

  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig || gig.status !== "OPEN") {
    return jsonError("Gig not available for bidding", 400);
  }

  const existing = await prisma.bid.findUnique({
    where: { gigId_freelancerId: { gigId, freelancerId: user.id } },
  });
  if (existing) return jsonError("Already bid on this gig", 400);

  const bid = await prisma.bid.create({
    data: {
      gigId,
      freelancerId: user.id,
      amount,
      deliveryDays,
      coverLetter,
      status: "PENDING",
    },
  });

  await prisma.gig.update({ where: { id: gigId }, data: { bidCount: { increment: 1 } } });

  return Response.json(bid, { status: 201 });
}
