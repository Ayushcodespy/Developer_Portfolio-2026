import logging
from functools import lru_cache
from pathlib import Path

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

# Base directory for resolving .env regardless of current working directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILES = (
    str(BASE_DIR / ".env"),
    str(BASE_DIR.parent / ".env"),
    ".env",
)


class Settings(BaseSettings):
    # Application Environment
    environment: str = "development"

    # Database (loaded from .env; defaults to local SQLite for development)
    database_url: str = "sqlite:///./portfolio.db"

    # Security & Secrets (loaded strictly from environment or .env)
    secret_key: str = "portfolio-secret-key-change-in-production"
    jwt_secret: str = "portfolio-jwt-secret-change-in-production"
    admin_session_minutes: int = 480
    cookie_secure: bool = False

    # URLs & Domains (loaded from environment or .env)
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"
    portfolio_url: str = ""
    resume_url: str = ""

    # Admin Credentials (used for initial bootstrap)
    admin_username: str = "admin"
    admin_password: str | None = None

    # SMTP Email Configuration
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_from_name: str = "Ayush Patel Portfolio"
    smtp_use_tls: bool = True
    contact_receiver_email: str | None = None

    model_config = SettingsConfigDict(
        env_file=ENV_FILES,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """Validate required configuration and warn on insecure settings in production."""
        if self.environment.lower() == "production":
            warnings = []
            if not self.secret_key or "change-in-production" in self.secret_key:
                warnings.append("SECRET_KEY should be set to a strong unique secret in production.")
            if not self.jwt_secret or "change-in-production" in self.jwt_secret:
                warnings.append("JWT_SECRET should be set to a strong unique secret in production.")
            if not self.database_url or "sqlite" in self.database_url.lower():
                warnings.append("DATABASE_URL is using SQLite. On Vercel, a cloud PostgreSQL database is required.")
            for w in warnings:
                logger.warning("Production Configuration Notice: %s", w)
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
