import { NextRequest } from "next/server";
import { prisma } from "@baseedwork/db";
import { getAuthUser, jsonError } from "../../../_lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true, gig: { select: { id: true, title: true } } },
  });

  if (!invoice) return jsonError("Invoice not found", 404);
  return Response.json(invoice);
}
