import { NextResponse } from "next/server";
import { prisma } from "@hiresense/db";

const STATIC_USER_ID = "static-admin-user";
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin123";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password, role } = body;

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const userRole = role === "EMPLOYER" ? "EMPLOYER" : "FREELANCER";

  // Ensure user exists in the database
  const dbUser = await prisma.user.upsert({
    where: { supabaseId: STATIC_USER_ID },
    update: { role: userRole },
    create: {
      supabaseId: STATIC_USER_ID,
      email: "admin@hiresense.in",
      role: userRole,
    },
    include: {
      freelancerProfile: true,
      employerProfile: true,
    },
  });

  // Create profile if missing
  if (userRole === "FREELANCER" && !dbUser.freelancerProfile) {
    await prisma.freelancerProfile.create({
      data: { userId: dbUser.id, displayName: "Admin" },
    });
  }
  if (userRole === "EMPLOYER" && !dbUser.employerProfile) {
    await prisma.employerProfile.create({
      data: { userId: dbUser.id, displayName: "Admin" },
    });
  }

  const response = NextResponse.json({ success: true, role: userRole });
  response.cookies.set("hiresense-auth", "admin", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
