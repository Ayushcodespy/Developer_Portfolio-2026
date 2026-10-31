import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from app.database.session import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255))
    description = Column(Text, nullable=False)
    category = Column(String(100))
    technologies = Column(Text)  # JSON string of technologies
    features = Column(Text)  # JSON string of features
    github_url = Column(String(500))
    live_url = Column(String(500))
    image_url = Column(String(500))
    visual_type = Column(String(50))
    featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())