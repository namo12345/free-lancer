import { Router, Response } from "express";
import { prisma } from "@hiresense/db";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const router = Router();

// GET /api/v1/gigs - List open gigs
router.get("/", async (req, res: Response) => {
  const { category, search, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Record<string, unknown> = { status: "OPEN" };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: "insensitive" } },
      { description: { contains: String(search), mode: "insensitive" } },
    ];
  }

  const [gigs, total] = await Promise.all([
    prisma.gig.findMany({
      where,
      include: {
        skills: { include: { skill: true } },
        poster: { include: { employerProfile: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.gig.count({ where }),
  ]);

  res.json({ gigs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

// GET /api/v1/gigs/:id - Get gig detail
router.get("/:id", async (req, res: Response) => {
  const gig = await prisma.gig.findUnique({
    where: { id: req.params.id },
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

  if (!gig) return res.status(404).json({ error: "Gig not found" });

  // Increment view count
  await prisma.gig.update({ where: { id: req.params.id }, data: { viewCount: { increment: 1 } } });

  res.json(gig);
});

// POST /api/v1/gigs - Create a gig (auth required)
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || dbUser.role !== "EMPLOYER") {
    return res.status(403).json({ error: "Only employers can post gigs" });
  }

  const { title, description, category, budgetMin, budgetMax, budgetType, deadline, duration, experienceLevel, isRemote, city, state, skillIds } = req.body;

  const gig = await prisma.gig.create({
    data: {
      posterId: dbUser.id,
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      budgetType: budgetType || "fixed",
      deadline: deadline ? new Date(deadline) : null,
      duration,
      experienceLevel,
      isRemote: isRemote ?? true,
      city,
      state,
      status: "OPEN",
      publishedAt: new Date(),
      skills: {
        create: (skillIds || []).map((skillId: string) => ({ skillId })),
      },
    },
    include: { skills: { include: { skill: true } } },
  });

  res.status(201).json(gig);
});

// PATCH /api/v1/gigs/:id/status - Update gig status
router.patch("/:id/status", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const gig = await prisma.gig.findUnique({ where: { id: req.params.id } });
  if (!gig) return res.status(404).json({ error: "Gig not found" });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || gig.posterId !== dbUser.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const updated = await prisma.gig.update({
    where: { id: req.params.id },
    data: { status },
  });

  res.json(updated);
});

export default router;
