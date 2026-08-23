from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.api.routes import auth, candidate, hr

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="AI-powered job discovery & recruitment platform API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_ORIGIN.rstrip("/"),
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(candidate.router)
app.include_router(hr.router)


@app.on_event("startup")
def on_startup():
    # For quick local bootstrap. In production, use Alembic migrations
    # (`alembic upgrade head`) instead of create_all.
    Base.metadata.create_all(bind=engine)


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}
