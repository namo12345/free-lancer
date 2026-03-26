from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    category: str | None = None
    city: str | None = None
    min_rating: float | None = None
    limit: int = 10


class MatchScoreRequest(BaseModel):
    gig_description: str
    gig_skills: list[str]
    freelancer_bio: str
    freelancer_skills: list[str]


class MatchScoreResponse(BaseModel):
    score: float
    rationale: str


class SearchResult(BaseModel):
    id: str
    display_name: str | None = None
    title: str | None = None
    distance: float
    headline: str | None = None


class SearchResponse(BaseModel):
    results: list[SearchResult]
    query_understanding: str


class PricingSuggestion(BaseModel):
    low: int
    fair: int
    high: int
    explanation: str


class SkillExtractionRequest(BaseModel):
    text: str


class SkillExtractionResponse(BaseModel):
    skills: list[str]
