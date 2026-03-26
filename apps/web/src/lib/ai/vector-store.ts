import { prisma } from "@hiresense/db";

export async function searchFreelancers(params: {
  queryEmbedding: number[];
  limit?: number;
  category?: string;
  city?: string;
  minRating?: number;
}) {
  const { queryEmbedding, limit = 10, category, city, minRating } = params;
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (category) {
    conditions.push(`fp.category = $${paramIndex++}`);
    values.push(category);
  }
  if (city) {
    conditions.push(`fp.city = $${paramIndex++}`);
    values.push(city);
  }
  if (minRating) {
    conditions.push(`fp."avgRating" >= $${paramIndex++}`);
    values.push(minRating);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const results = await prisma.$queryRawUnsafe(
    `SELECT
      fp.id,
      fp."userId",
      fp."displayName",
      fp.headline,
      fp.bio,
      fp.city,
      fp.state,
      fp."hourlyRate",
      fp."avgRating",
      fp."completedGigs",
      fp.embedding <=> '${embeddingStr}'::vector AS distance
    FROM "FreelancerProfile" fp
    ${whereClause}
    ORDER BY distance
    LIMIT $${paramIndex}`,
    ...values,
    limit
  );

  return results;
}

export async function searchGigs(params: {
  queryEmbedding: number[];
  limit?: number;
  category?: string;
}) {
  const { queryEmbedding, limit = 10, category } = params;
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const conditions: string[] = [`g.status = 'OPEN'`];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (category) {
    conditions.push(`g.category = $${paramIndex++}`);
    values.push(category);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const results = await prisma.$queryRawUnsafe(
    `SELECT
      g.id,
      g.title,
      g.description,
      g.category,
      g."budgetMin",
      g."budgetMax",
      g."isRemote",
      g.city,
      g.embedding <=> '${embeddingStr}'::vector AS distance
    FROM "Gig" g
    ${whereClause}
    ORDER BY distance
    LIMIT $${paramIndex}`,
    ...values,
    limit
  );

  return results;
}
