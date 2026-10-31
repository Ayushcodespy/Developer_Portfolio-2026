import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()
db_url = settings.database_url or "sqlite:///./portfolio.db"

# Handle PostgreSQL URLs for Vercel / Cloud deployments
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

if db_url.startswith("postgresql://") and "+" not in db_url.split("://")[0]:
    # Determine the best available PostgreSQL driver
    # Priority: psycopg (v3) -> pg8000 (pure python, 0 binary issues) -> psycopg2
    try:
        import psycopg  # noqa: F401
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
    except ImportError:
        try:
            import pg8000  # noqa: F401
            db_url = db_url.replace("postgresql://", "postgresql+pg8000://", 1)
        except ImportError:
            pass  # Fall back to default psycopg2

connect_args = {"check_same_thread": False} if "sqlite" in db_url.lower() else {}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
