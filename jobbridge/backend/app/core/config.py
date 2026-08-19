from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "JobBridge API"
    SECRET_KEY: str = "dev-secret-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str = "postgresql://jobbridge:jobbridge@localhost:5432/jobbridge"

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    FRONTEND_ORIGIN: str = "http://localhost:5173"

    UPLOAD_DIR: str = "app/static/resumes"
    MAX_UPLOAD_SIZE_MB: int = 10
    
    ADZUNA_APP_ID: str = ""
    ADZUNA_APP_KEY: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
