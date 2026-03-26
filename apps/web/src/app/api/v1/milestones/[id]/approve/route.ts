import { NextRequest } from "next/server";
import { prisma } from "@baseedwork/db";
import { getAuthUser, jsonError } from "../../../../_lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const milestone = await prisma.milestone.findUnique({
    where: { id },
    include: { gig: true },
  });
  if (!milestone) return jsonError("Milestone not found", 404);
  if (milestone.gig.posterId !== user.id) return jsonError("Not authorized", 403);

  const updated = await prisma.milestone.update({
    where: { id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });

  const allMilestones = await prisma.milestone.findMany({ where: { gigId: milestone.gigId } });
  const allApproved = allMilestones.every((m) => m.status === "APPROVED");

  if (allApproved) {
    await prisma.gig.update({ where: { id: milestone.gigId }, data: { status: "COMPLETED" } });
  }

  return Response.json({ milestone: updated, gigCompleted: allApproved });
}
