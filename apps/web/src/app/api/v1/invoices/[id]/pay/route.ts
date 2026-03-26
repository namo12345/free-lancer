import { NextRequest } from "next/server";
import { prisma } from "@baseedwork/db";
import { getAuthUser, jsonError } from "../../../../_lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return jsonError("Invoice not found", 404);
  if (invoice.employerId !== user.id) return jsonError("Only the employer can mark as paid", 403);

  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });

  return Response.json(updated);
}
