import { NextRequest } from "next/server";
import { prisma } from "@hiresense/db";
import { getAuthUser, jsonError } from "../../_lib/auth";

const PLATFORM_FEE_PERCENT = 10;
const GST_PERCENT = 18;

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `BW-${year}-${rand}`;
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const where = user.role === "EMPLOYER"
    ? { employerId: user.id }
    : { freelancerId: user.id };

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      items: true,
      gig: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(invoices);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "EMPLOYER") {
    return jsonError("Only employers can create invoices", 403);
  }

  const { gigId, milestones, dueDate, notes } = await req.json();

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: { bids: { where: { status: "ACCEPTED" } } },
  });
  if (!gig) return jsonError("Gig not found", 404);

  const acceptedBid = gig.bids[0];
  if (!acceptedBid) return jsonError("No accepted bid for this gig", 400);
  if (gig.posterId !== user.id) return jsonError("Not authorized", 403);

  const subtotal = milestones.reduce((sum: number, m: { amount: number }) => sum + m.amount, 0);
  const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENT / 100);
  const gst = Math.round(platformFee * GST_PERCENT / 100);
  const total = subtotal + platformFee + gst;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      gigId,
      employerId: user.id,
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

  return Response.json(invoice, { status: 201 });
}
