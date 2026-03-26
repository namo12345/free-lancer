import json
from app.services.llm import chat_completion


async def compute_match_score(
    gig_description: str,
    gig_skills: list[str],
    freelancer_bio: str,
    freelancer_skills: list[str],
) -> dict:
    """Use OpenRouter free LLM to score freelancer-gig compatibility."""

    prompt = f"""You are an AI matchmaking system for a freelancing platform.
Score the compatibility between this gig and freelancer from 0-100.

GIG:
Description: {gig_description[:500]}
Required Skills: {', '.join(gig_skills)}

FREELANCER:
Bio: {freelancer_bio[:500]}
Skills: {', '.join(freelancer_skills)}

Respond in JSON format ONLY:
{{"score": <number 0-100>, "rationale": "<1-2 sentence explanation>"}}"""

    response = await chat_completion(
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=200,
    )

    try:
        result = json.loads(response)
        return {
            "score": min(100, max(0, float(result.get("score", 50)))),
            "rationale": result.get("rationale", "Match score computed."),
        }
    except (json.JSONDecodeError, ValueError):
        return {"score": 50, "rationale": "Unable to compute precise match score."}


async def suggest_pricing(
    description: str,
    skills: list[str],
    budget_type: str = "fixed",
) -> dict:
    """Use OpenRouter free LLM for rule-based pricing suggestions."""

    prompt = f"""You are a pricing advisor for an Indian freelancing platform.
Suggest a fair price range in INR for this project.

Description: {description[:500]}
Skills: {', '.join(skills)}
Type: {budget_type}

Consider Indian market rates. Respond in JSON ONLY:
{{"low": <number>, "fair": <number>, "high": <number>, "explanation": "<brief>"}}"""

    response = await chat_completion(
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=200,
    )

    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {"low": 5000, "fair": 15000, "high": 30000, "explanation": "Default estimate."}
