import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class EducationBase(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    location: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    cgpa: Optional[str] = None
    percentage: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0


class EducationCreate(EducationBase):
    pass


class EducationUpdate(EducationBase):
    pass


class EducationResponse(EducationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True