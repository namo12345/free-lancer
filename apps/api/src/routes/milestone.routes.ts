import { Router, Response } from "express";
import { prisma } from "@hiresense/db";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/v1/milestones/gig/:gigId - Get milestones for a gig
router.get("/gig/:gigId", async (req, res: Response) => {
  const milestones = await prisma.milestone.findMany({
    where: { gigId: req.params.gigId },
    include: { deliverables: true },
    orderBy: { orderIndex: "asc" },
  });

  res.json(milestones);
});

// PATCH /api/v1/milestones/:id/submit - Freelancer submits deliverable
router.patch("/:id/submit", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { deliverables } = req.body; // [{ fileName, fileUrl, fileSize, note }]

  const milestone = await prisma.milestone.findUnique({
    where: { id: req.params.id },
    include: { gig: { include: { bids: { where: { status: "ACCEPTED" } } } } },
  });
  if (!milestone) return res.status(404).json({ error: "Milestone not found" });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  const acceptedBid = milestone.gig.bids[0];
  if (!dbUser || !acceptedBid || acceptedBid.freelancerId !== dbUser.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // Create deliverables and update status
  if (deliverables?.length) {
    await prisma.milestoneDeliverable.createMany({
      data: deliverables.map((d: { fileName: string; fileUrl: string; fileSize: number; note?: string }) => ({
        milestoneId: req.params.id,
        ...d,
      })),
    });
  }

  const updated = await prisma.milestone.update({
    where: { id: req.params.id },
    data: { status: "SUBMITTED", submittedAt: new Date() },
    include: { deliverables: true },
  });

  res.json(updated);
});

// PATCH /api/v1/milestones/:id/approve - Employer approves milestone
router.patch("/:id/approve", authMiddleware, async (req: AuthRequest, res: Response) => {
  const milestone = await prisma.milestone.findUnique({
    where: { id: req.params.id },
    include: { gig: true },
  });
  if (!milestone) return res.status(404).json({ error: "Milestone not found" });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || milestone.gig.posterId !== dbUser.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const updated = await prisma.milestone.update({
    where: { id: req.params.id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });

  // Check if all milestones are approved → complete the gig
  const allMilestones = await prisma.milestone.findMany({
    where: { gigId: milestone.gigId },
  });
  const allApproved = allMilestones.every((m) => m.status === "APPROVED");

  if (allApproved) {
    await prisma.gig.update({
      where: { id: milestone.gigId },
      data: { status: "COMPLETED" },
    });
  }

  res.json({ milestone: updated, gigCompleted: allApproved });
});

export default router;
