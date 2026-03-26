import { Router, Response } from "express";
import { prisma } from "@hiresense/db";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const router = Router();

// POST /api/v1/bids - Submit a bid
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || dbUser.role !== "FREELANCER") {
    return res.status(403).json({ error: "Only freelancers can bid" });
  }

  const { gigId, amount, deliveryDays, coverLetter } = req.body;

  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig || gig.status !== "OPEN") {
    return res.status(400).json({ error: "Gig not available for bidding" });
  }

  const existing = await prisma.bid.findUnique({
    where: { gigId_freelancerId: { gigId, freelancerId: dbUser.id } },
  });
  if (existing) return res.status(400).json({ error: "Already bid on this gig" });

  const bid = await prisma.bid.create({
    data: {
      gigId,
      freelancerId: dbUser.id,
      amount,
      deliveryDays,
      coverLetter,
      status: "PENDING",
    },
  });

  await prisma.gig.update({ where: { id: gigId }, data: { bidCount: { increment: 1 } } });

  // TODO: Call AI service for match score
  // const matchResult = await fetch(`${AI_SERVICE_URL}/ai/v1/match/score`, {...})

  res.status(201).json(bid);
});

// GET /api/v1/bids/my - Get freelancer's bids
router.get("/my", authMiddleware, async (req: AuthRequest, res: Response) => {
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser) return res.status(404).json({ error: "User not found" });

  const bids = await prisma.bid.findMany({
    where: { freelancerId: dbUser.id },
    include: { gig: { select: { id: true, title: true, category: true, budgetMin: true, budgetMax: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json(bids);
});

// GET /api/v1/bids/gig/:gigId - Get bids for a gig (employer only)
router.get("/gig/:gigId", authMiddleware, async (req: AuthRequest, res: Response) => {
  const gig = await prisma.gig.findUnique({ where: { id: req.params.gigId } });
  if (!gig) return res.status(404).json({ error: "Gig not found" });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || gig.posterId !== dbUser.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const bids = await prisma.bid.findMany({
    where: { gigId: req.params.gigId },
    include: { freelancer: { include: { freelancerProfile: true } } },
    orderBy: { matchScore: "desc" },
  });

  res.json(bids);
});

// PATCH /api/v1/bids/:id/accept - Accept a bid
router.patch("/:id/accept", authMiddleware, async (req: AuthRequest, res: Response) => {
  const bid = await prisma.bid.findUnique({
    where: { id: req.params.id },
    include: { gig: true },
  });
  if (!bid) return res.status(404).json({ error: "Bid not found" });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || bid.gig.posterId !== dbUser.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await prisma.$transaction([
    prisma.bid.update({ where: { id: req.params.id }, data: { status: "ACCEPTED" } }),
    prisma.bid.updateMany({
      where: { gigId: bid.gigId, id: { not: req.params.id } },
      data: { status: "REJECTED" },
    }),
    prisma.gig.update({ where: { id: bid.gigId }, data: { status: "IN_PROGRESS" } }),
  ]);

  res.json({ success: true });
});

// PATCH /api/v1/bids/:id/reject - Reject a bid
router.patch("/:id/reject", authMiddleware, async (req: AuthRequest, res: Response) => {
  const bid = await prisma.bid.findUnique({ where: { id: req.params.id }, include: { gig: true } });
  if (!bid) return res.status(404).json({ error: "Bid not found" });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || bid.gig.posterId !== dbUser.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await prisma.bid.update({ where: { id: req.params.id }, data: { status: "REJECTED" } });
  res.json({ success: true });
});

export default router;
