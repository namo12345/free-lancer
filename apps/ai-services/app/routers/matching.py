from fastapi import APIRouter
from app.models.schemas import (
    MatchScoreRequest,
    MatchScoreResponse,
    PricingSuggestion,
    SkillExtractionRequest,
    SkillExtractionResponse,
)
from app.services.matching import compute_match_score, suggest_pricing
from app.services.llm import chat_completion
import json

router = APIRouter()


@router.post("/score", response_model=MatchScoreResponse)
async def get_match_score(request: MatchScoreRequest):
    """Score compatibility between a freelancer and a gig."""
    result = await compute_match_score(
        gig_description=request.gig_description,
        gig_skills=request.gig_skills,
        freelancer_bio=request.freelancer_bio,
        freelancer_skills=request.freelancer_skills,
    )
    return MatchScoreResponse(score=result["score"], rationale=result["rationale"])


@router.post("/pricing", response_model=PricingSuggestion)
async def get_pricing_suggestion(
    description: str,
    skills: list[str],
    budget_type: str = "fixed",
):
    """Get AI-suggested pricing for a gig."""
    return await suggest_pricing(description, skills, budget_type)


@router.post("/skills/extract", response_model=SkillExtractionResponse)
async def extract_skills(request: SkillExtractionRequest):
    """Extract skills from a text description."""
    prompt = f"""Extract technical and professional skills from this text.
Return a JSON array of skill names only. Max 10 skills.

Text: {request.text[:1000]}

Respond with JSON ONLY: ["skill1", "skill2", ...]"""

    response = await chat_completion(
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=200,
    )

    try:
        skills = json.loads(response)
        if isinstance(skills, list):
            return SkillExtractionResponse(skills=skills[:10])
    except json.JSONDecodeError:
        pass

    return SkillExtractionResponse(skills=[])
