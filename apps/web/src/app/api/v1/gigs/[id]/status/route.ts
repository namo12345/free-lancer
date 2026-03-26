import { NextRequest } from "next/server";
import { prisma } from "@baseedwork/db";
import { getAuthUser, jsonError } from "../../../../_lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);

  const gig = await prisma.gig.findUnique({ where: { id } });
  if (!gig) return jsonError("Gig not found", 404);
  if (gig.posterId !== user.id) return jsonError("Not authorized", 403);

  const { status } = await req.json();
  const updated = await prisma.gig.update({ where: { id }, data: { status } });
  return Response.json(updated);
}
