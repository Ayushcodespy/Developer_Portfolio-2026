from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./portfolio.db"
    secret_key: str = "development-only-change-me"
    frontend_url: str = "http://localhost:5173"
    jwt_secret: str = "portfolio-admin-super-secure-jwt-secret-key-2026"
    admin_session_minutes: int = 480
    cookie_secure: bool = False

    # SMTP Email Settings
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    smtp_from_name: str = "Ayush Patel Portfolio"
    smtp_use_tls: bool = True
    contact_receiver_email: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
