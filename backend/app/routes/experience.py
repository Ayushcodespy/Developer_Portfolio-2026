import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.experience import Experience
from app.schemas.experience import ExperienceResponse

router = APIRouter(prefix="/experience", tags=["experience"])


@router.get("", response_model=List[ExperienceResponse])
def get_experience(db: Session = Depends(get_db)):
    """Get all experience entries ordered by display order."""
    experience = db.query(Experience).order_by(Experience.display_order).all()
    return experience