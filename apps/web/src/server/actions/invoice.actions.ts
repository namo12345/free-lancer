"use server";

import { prisma } from "@baseedwork/db";
import { createClient } from "@/lib/supabase/server";
import { generateInvoiceNumber } from "@/lib/utils";
import { PLATFORM_FEE_PERCENT, GST_PERCENT } from "@baseedwork/shared";

export async function createInvoice(gigId: string, milestones: { title: string; amount: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      bids: { where: { status: "ACCEPTED" } },
    },
  });
  if (!gig) throw new Error("Gig not found");

  const acceptedBid = gig.bids[0];
  if (!acceptedBid) throw new Error("No accepted bid for this gig");

  const subtotal = milestones.reduce((sum, m) => sum + m.amount, 0);
  const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENT / 100);
  const gst = Math.round(platformFee * GST_PERCENT / 100);
  const total = subtotal + platformFee + gst;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: generateInvoiceNumber(),
      gigId,
      employerId: gig.posterId,
      freelancerId: acceptedBid.freelancerId,
      subtotal,
      platformFee,
      gst,
      totalAmount: total,
      dueDate,
      status: "SENT",
      items: {
        create: milestones.map((m, idx) => ({
          description: m.title,
          quantity: 1,
          rate: m.amount,
          amount: m.amount,
        })),
      },
    },
    include: { items: true },
  });

  // Create milestones for tracking
  for (let i = 0; i < milestones.length; i++) {
    await prisma.milestone.create({
      data: {
        gigId,
        title: milestones[i].title,
        amount: milestones[i].amount,
        orderIndex: i + 1,
        status: "PENDING",
      },
    });
  }

  return { success: true, invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber };
}

export async function markInvoicePaid(invoiceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID", paidAt: new Date() },
  });

  return { success: true };
}

export async function getInvoicesForUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  const where = dbUser.role === "EMPLOYER"
    ? { employerId: dbUser.id }
    : { freelancerId: dbUser.id };

  return prisma.invoice.findMany({
    where,
    include: { items: true, gig: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
}
