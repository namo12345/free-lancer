import { prisma } from "@hiresense/db";

export async function GET(_req: Request, { params }: { params: Promise<{ gigId: string }> }) {
  const { gigId } = await params;

  const milestones = await prisma.milestone.findMany({
    where: { gigId },
    include: { deliverables: true },
    orderBy: { orderIndex: "asc" },
  });

  return Response.json(milestones);
}
