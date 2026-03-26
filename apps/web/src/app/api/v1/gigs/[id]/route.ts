import { prisma } from "@hiresense/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const gig = await prisma.gig.findUnique({
    where: { id },
    include: {
      skills: { include: { skill: true } },
      poster: { include: { employerProfile: true } },
      bids: {
        include: { freelancer: { include: { freelancerProfile: true } } },
        orderBy: { matchScore: "desc" },
      },
      milestones: { orderBy: { orderIndex: "asc" } },
      invoices: true,
    },
  });

  if (!gig) return Response.json({ error: "Gig not found" }, { status: 404 });

  await prisma.gig.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  return Response.json(gig);
}
