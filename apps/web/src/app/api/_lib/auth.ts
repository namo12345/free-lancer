import { prisma } from "@hiresense/db";
import { NextRequest } from "next/server";

const STATIC_USER_ID = "static-admin-user";

export async function getAuthUser(req: NextRequest) {
  // Check cookie-based static auth
  const authCookie = req.cookies.get("hiresense-auth");
  if (authCookie?.value !== "admin") {
    // Also check Bearer token for API compatibility
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ") || authHeader.split(" ")[1] !== "static-token") {
      return null;
    }
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: STATIC_USER_ID },
  });

  return dbUser;
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
