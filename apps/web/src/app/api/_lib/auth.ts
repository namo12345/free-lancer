import { prisma } from "@hiresense/db";
import { NextRequest } from "next/server";

const SUPABASE_IDS: Record<string, string> = {
  freelancer: "static-freelancer-user",
  employer: "static-employer-user",
};

export async function getAuthUser(req: NextRequest) {
  const authCookie = req.cookies.get("hiresense-auth");
  const cookieValue = authCookie?.value;

  if (cookieValue && SUPABASE_IDS[cookieValue]) {
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: SUPABASE_IDS[cookieValue] },
    });
    return dbUser;
  }

  // Also allow Bearer token for API compatibility (e.g., Postman/mobile)
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token === "static-freelancer-token") {
      return prisma.user.findUnique({ where: { supabaseId: "static-freelancer-user" } });
    }
    if (token === "static-employer-token") {
      return prisma.user.findUnique({ where: { supabaseId: "static-employer-user" } });
    }
  }

  return null;
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
