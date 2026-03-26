import { NextRequest } from "next/server";
import { prisma } from "@hiresense/db";
import { getAuthUser, jsonError } from "../../../../_lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const { deliverables } = await req.json();

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { gig: { include: { bids: { where: { status: "ACCEPTED" } } } } },
  });
  if (!milestone) return jsonError("Milestone not found", 404);

  const acceptedBid = milestone.gig.bids[0];
  if (!acceptedBid || acceptedBid.freelancerId !== user.id) {
    return jsonError("Not authorized", 403);
  }

  if (deliverables?.length) {
    await prisma.milestoneDeliverable.createMany({
      data: deliverables.map((d: { fileName: string; fileUrl: string; fileSize: number; note?: string }) => ({
        milestoneId: id,
        ...d,
      })),
    });
  }

  const updated = await prisma.milestone.update({
    where: { id },
    data: { status: "SUBMITTED", submittedAt: new Date() },
    include: { deliverables: true },
  });

  return Response.json(updated);
}
