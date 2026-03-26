import psycopg2
from app.core.config import settings


def get_connection():
    """Get a connection to Supabase PostgreSQL."""
    return psycopg2.connect(settings.database_url)


def similarity_search_freelancers(
    query_embedding: list[float],
    limit: int = 10,
    category: str | None = None,
    city: str | None = None,
    min_rating: float | None = None,
) -> list[dict]:
    """Search freelancer profiles by vector similarity using pgvector."""
    conn = get_connection()
    try:
        cur = conn.cursor()

        # Build query with optional filters
        conditions = []
        params = []

        if category:
            conditions.append("fp.category = %s")
            params.append(category)
        if city:
            conditions.append("fp.city = %s")
            params.append(city)
        if min_rating:
            conditions.append('fp."avgRating" >= %s')
            params.append(min_rating)

        where_clause = ""
        if conditions:
            where_clause = "WHERE " + " AND ".join(conditions)

        embedding_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

        query = f"""
            SELECT
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
                fp.embedding <=> '{embedding_str}'::vector AS distance
            FROM "FreelancerProfile" fp
            {where_clause}
            ORDER BY distance
            LIMIT %s
        """
        params.append(limit)

        cur.execute(query, params)
        columns = [desc[0] for desc in cur.description]
        results = [dict(zip(columns, row)) for row in cur.fetchall()]
        return results
    finally:
        conn.close()


def similarity_search_gigs(
    query_embedding: list[float],
    limit: int = 10,
    category: str | None = None,
    is_remote: bool | None = None,
) -> list[dict]:
    """Search gigs by vector similarity using pgvector."""
    conn = get_connection()
    try:
        cur = conn.cursor()

        conditions = ['g.status = %s']
        params = ["OPEN"]

        if category:
            conditions.append("g.category = %s")
            params.append(category)
        if is_remote is not None:
            conditions.append('g."isRemote" = %s')
            params.append(is_remote)

        where_clause = "WHERE " + " AND ".join(conditions)
        embedding_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

        query = f"""
            SELECT
                g.id,
                g.title,
                g.description,
                g.category,
                g."budgetMin",
                g."budgetMax",
                g."isRemote",
                g.city,
                g.embedding <=> '{embedding_str}'::vector AS distance
            FROM "Gig" g
            {where_clause}
            ORDER BY distance
            LIMIT %s
        """
        params.append(limit)

        cur.execute(query, params)
        columns = [desc[0] for desc in cur.description]
        results = [dict(zip(columns, row)) for row in cur.fetchall()]
        return results
    finally:
        conn.close()
