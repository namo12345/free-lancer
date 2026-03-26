import { NextRequest } from "next/server";
import { prisma } from "@baseedwork/db";
import { getAuthUser, jsonError } from "../../../../_lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const bid = await prisma.bid.findUnique({ where: { id }, include: { gig: true } });
  if (!bid) return jsonError("Bid not found", 404);
  if (bid.gig.posterId !== user.id) return jsonError("Not authorized", 403);

  await prisma.$transaction([
    prisma.bid.update({ where: { id }, data: { status: "ACCEPTED" } }),
    prisma.bid.updateMany({
      where: { gigId: bid.gigId, id: { not: id } },
      data: { status: "REJECTED" },
    }),
    prisma.gig.update({ where: { id: bid.gigId }, data: { status: "IN_PROGRESS" } }),
  ]);

  return Response.json({ success: true });
}
