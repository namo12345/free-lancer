from fastapi import APIRouter
from app.models.schemas import SearchRequest, SearchResponse, SearchResult
from app.services.embeddings import generate_embedding
from app.services.vector_store import similarity_search_freelancers, similarity_search_gigs

router = APIRouter()


@router.post("/freelancers", response_model=SearchResponse)
async def search_freelancers(request: SearchRequest):
    """Semantic search for freelancers using pgvector."""
    query_embedding = await generate_embedding(request.query)

    results = similarity_search_freelancers(
        query_embedding=query_embedding,
        limit=request.limit,
        category=request.category,
        city=request.city,
        min_rating=request.min_rating,
    )

    return SearchResponse(
        results=[
            SearchResult(
                id=r["id"],
                display_name=r.get("displayName"),
                headline=r.get("headline"),
                distance=r.get("distance", 0),
            )
            for r in results
        ],
        query_understanding=f"Searching for: {request.query}",
    )


@router.post("/gigs", response_model=SearchResponse)
async def search_gigs(request: SearchRequest):
    """Semantic search for gigs using pgvector."""
    query_embedding = await generate_embedding(request.query)

    results = similarity_search_gigs(
        query_embedding=query_embedding,
        limit=request.limit,
        category=request.category,
    )

    return SearchResponse(
        results=[
            SearchResult(
                id=r["id"],
                title=r.get("title"),
                distance=r.get("distance", 0),
            )
            for r in results
        ],
        query_understanding=f"Searching for: {request.query}",
    )
