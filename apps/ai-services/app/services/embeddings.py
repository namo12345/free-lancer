import httpx
from app.core.config import settings


async def generate_embedding(text: str) -> list[float]:
    """Generate embeddings using HuggingFace Inference API (free tier)."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api-inference.huggingface.co/pipeline/feature-extraction/{settings.embedding_model}",
            headers={"Authorization": f"Bearer {settings.huggingface_api_key}"},
            json={"inputs": text, "options": {"wait_for_model": True}},
            timeout=30.0,
        )
        response.raise_for_status()
        embedding = response.json()

        # HuggingFace returns nested array for single input
        if isinstance(embedding[0], list):
            return embedding[0]
        return embedding


async def generate_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for multiple texts."""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api-inference.huggingface.co/pipeline/feature-extraction/{settings.embedding_model}",
            headers={"Authorization": f"Bearer {settings.huggingface_api_key}"},
            json={"inputs": texts, "options": {"wait_for_model": True}},
            timeout=60.0,
        )
        response.raise_for_status()
        return response.json()
