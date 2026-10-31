import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime


class ProjectBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: str
    category: Optional[str] = None
    technologies: Optional[str] = None  # JSON string
    features: Optional[str] = None  # JSON string
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    visual_type: Optional[str] = None
    featured: bool = False
    display_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True