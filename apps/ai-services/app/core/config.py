from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # OpenRouter (free LLM access)
    openrouter_api_key: str = ""
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    default_model: str = "meta-llama/llama-3.1-8b-instruct:free"

    # HuggingFace (free embeddings)
    huggingface_api_key: str = ""
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dimensions: int = 384

    # Supabase (database with pgvector)
    database_url: str = ""
    supabase_url: str = ""
    supabase_service_key: str = ""

    # Service
    api_url: str = "http://localhost:4000"
    environment: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()
