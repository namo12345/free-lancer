import { NextRequest } from "next/server";
import { prisma } from "@hiresense/db";
import { getAuthUser, jsonError } from "../../_lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { status: "OPEN" };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [gigs, total] = await Promise.all([
    prisma.gig.findMany({
      where,
      include: {
        skills: { include: { skill: true } },
        poster: { include: { employerProfile: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.gig.count({ where }),
  ]);

  return Response.json({ gigs, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "EMPLOYER") {
    return jsonError("Only employers can post gigs", 403);
  }

  const body = await req.json();
  const { title, description, category, budgetMin, budgetMax, budgetType, deadline, duration, experienceLevel, isRemote, city, state, skillIds } = body;

  const gig = await prisma.gig.create({
    data: {
      posterId: user.id,
      title,
      description,
      category,
      budgetMin,
      budgetMax,
      budgetType: budgetType || "fixed",
      deadline: deadline ? new Date(deadline) : null,
      duration,
      experienceLevel,
      isRemote: isRemote ?? true,
      city,
      state,
      status: "OPEN",
      publishedAt: new Date(),
      skills: {
        create: (skillIds || []).map((skillId: string) => ({ skillId })),
      },
    },
    include: { skills: { include: { skill: true } } },
  });

  return Response.json(gig, { status: 201 });
}
