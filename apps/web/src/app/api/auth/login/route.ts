import { NextResponse } from "next/server";
import { prisma } from "@hiresense/db";

const USERS = {
  freelancer: {
    password: "freelancer123",
    supabaseId: "static-freelancer-user",
    email: "freelancer@hiresense.in",
    role: "FREELANCER" as const,
    displayName: "Arjun Sharma",
  },
  employer: {
    password: "employer123",
    supabaseId: "static-employer-user",
    email: "employer@hiresense.in",
    role: "EMPLOYER" as const,
    displayName: "TechVenture Solutions",
  },
};

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  const user = USERS[username as keyof typeof USERS];
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const dbUser = await prisma.user.upsert({
    where: { supabaseId: user.supabaseId },
    update: { role: user.role },
    create: {
      supabaseId: user.supabaseId,
      email: user.email,
      role: user.role,
    },
    include: {
      freelancerProfile: true,
      employerProfile: true,
    },
  });

  if (user.role === "FREELANCER" && !dbUser.freelancerProfile) {
    await prisma.freelancerProfile.create({
      data: { userId: dbUser.id, displayName: user.displayName },
    });
  }
  if (user.role === "EMPLOYER" && !dbUser.employerProfile) {
    await prisma.employerProfile.create({
      data: { userId: dbUser.id, displayName: user.displayName },
    });
  }

  const response = NextResponse.json({ success: true, role: user.role });
  response.cookies.set("hiresense-auth", username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
