import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.session import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillResponse

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=List[SkillResponse])
def get_skills(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all skills, optionally filtered by category."""
    query = db.query(Skill).order_by(Skill.display_order)
    if category:
        query = query.filter(Skill.category == category)
    skills = query.all()
    return skills