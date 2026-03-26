import { Router, Response } from "express";
import { prisma } from "@baseedwork/db";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const PLATFORM_FEE_PERCENT = 10;
const GST_PERCENT = 18;

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `BW-${year}-${rand}`;
}

const router = Router();

// POST /api/v1/invoices - Create an invoice after accepting a bid
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const { gigId, milestones, dueDate, notes } = req.body;

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || dbUser.role !== "EMPLOYER") {
    return res.status(403).json({ error: "Only employers can create invoices" });
  }

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: { bids: { where: { status: "ACCEPTED" } } },
  });
  if (!gig) return res.status(404).json({ error: "Gig not found" });

  const acceptedBid = gig.bids[0];
  if (!acceptedBid) return res.status(400).json({ error: "No accepted bid for this gig" });

  if (gig.posterId !== dbUser.id) {
    return res.status(403).json({ error: "Not authorized" });
  }

  const subtotal = milestones.reduce((sum: number, m: { amount: number }) => sum + m.amount, 0);
  const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENT / 100);
  const gst = Math.round(platformFee * GST_PERCENT / 100);
  const total = subtotal + platformFee + gst;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      gigId,
      employerId: dbUser.id,
      freelancerId: acceptedBid.freelancerId,
      subtotal,
      platformFee,
      gst,
      totalAmount: total,
      dueDate: new Date(dueDate),
      status: "SENT",
      notes,
      items: {
        create: milestones.map((m: { title: string; amount: number }) => ({
          description: m.title,
          quantity: 1,
          rate: m.amount,
          amount: m.amount,
        })),
      },
    },
    include: { items: true },
  });

  // Create milestone records for tracking
  for (let i = 0; i < milestones.length; i++) {
    await prisma.milestone.create({
      data: {
        gigId,
        title: milestones[i].title,
        description: milestones[i].description || null,
        amount: milestones[i].amount,
        orderIndex: i + 1,
        status: "PENDING",
      },
    });
  }

  res.status(201).json(invoice);
});

// GET /api/v1/invoices - Get user's invoices
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser) return res.status(404).json({ error: "User not found" });

  const where = dbUser.role === "EMPLOYER"
    ? { employerId: dbUser.id }
    : { freelancerId: dbUser.id };

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      items: true,
      gig: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(invoices);
});

// GET /api/v1/invoices/:id - Get invoice detail
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.id },
    include: {
      items: true,
      gig: { select: { id: true, title: true } },
    },
  });

  if (!invoice) return res.status(404).json({ error: "Invoice not found" });

  res.json(invoice);
});

// PATCH /api/v1/invoices/:id/pay - Mark invoice as paid
router.patch("/:id/pay", authMiddleware, async (req: AuthRequest, res: Response) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
  if (!invoice) return res.status(404).json({ error: "Invoice not found" });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: req.supabaseId } });
  if (!dbUser || invoice.employerId !== dbUser.id) {
    return res.status(403).json({ error: "Only the employer can mark as paid" });
  }

  const updated = await prisma.invoice.update({
    where: { id: req.params.id },
    data: { status: "PAID", paidAt: new Date() },
  });

  res.json(updated);
});

export default router;
