/**
 * POST /api/v1/ai/embeddings
 * Generates and stores vector embeddings for all freelancer profiles and open gigs.
 * Intended for admin use / periodic re-indexing.
 */
import { NextRequest } from "next/server";
import { prisma } from "@hiresense/db";
import { generateEmbedding } from "@/lib/ai/embeddings";
import { getAuthUser, jsonError } from "@/app/api/_lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return jsonError("Unauthorized", 401);
  if (user.role !== "ADMIN") return jsonError("Admin only", 403);

  const results = { freelancers: 0, gigs: 0, errors: 0 };

  // ── Freelancer embeddings ─────────────────────────────────────────────
  const freelancers = await prisma.freelancerProfile.findMany({
    include: { skills: { include: { skill: true } } },
  });

  for (const fp of freelancers) {
    const text = [
      fp.displayName,
      fp.headline,
      fp.bio,
      fp.skills.map((s) => s.skill.name).join(", "),
      fp.city,
      fp.state,
    ]
      .filter(Boolean)
      .join(". ");

    try {
      const embedding = await generateEmbedding(text);
      await prisma.$executeRawUnsafe(
        `UPDATE "FreelancerProfile" SET embedding = $1::vector WHERE id = $2`,
        `[${embedding.join(",")}]`,
        fp.id
      );
      results.freelancers++;
    } catch {
      results.errors++;
    }
  }

  // ── Gig embeddings ────────────────────────────────────────────────────
  const gigs = await prisma.gig.findMany({
    where: { status: "OPEN" },
    include: { skills: { include: { skill: true } } },
  });

  for (const gig of gigs) {
    const text = [
      gig.title,
      gig.description,
      gig.category,
      gig.skills.map((s) => s.skill.name).join(", "),
    ]
      .filter(Boolean)
      .join(". ");

    try {
      const embedding = await generateEmbedding(text);
      await prisma.$executeRawUnsafe(
        `UPDATE "Gig" SET embedding = $1::vector WHERE id = $2`,
        `[${embedding.join(",")}]`,
        gig.id
      );
      results.gigs++;
    } catch {
      results.errors++;
    }
  }

  return Response.json({ success: true, ...results });
}
