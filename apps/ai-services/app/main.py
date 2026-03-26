from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title="BaseedWork AI Services",
    description="AI-powered matching, search, and pricing for BaseedWork",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "baseedwork-ai"}


from app.routers.search import router as search_router
from app.routers.matching import router as matching_router

app.include_router(search_router, prefix="/ai/v1/search", tags=["search"])
app.include_router(matching_router, prefix="/ai/v1/match", tags=["matching"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
