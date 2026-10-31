import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database.session import get_db
from app.models.skill import Skill
from app.schemas.skill import SkillResponse

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=List[SkillResponse])
def get_skills(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all skills, optionally filtered by category."""
    query = db.query(Skill).order_by(Skill.display_order)
    if category and category.lower() != "all":
        cat_clean = category.lower().replace("-", " ")
        if cat_clean in {"data analysis", "data analyst"}:
            query = query.filter((func.lower(Skill.category) == "data analysis") | (func.lower(Skill.category) == "both"))
        elif cat_clean in {"development", "dev"}:
            query = query.filter((func.lower(Skill.category) == "development") | (func.lower(Skill.category) == "both"))
        elif cat_clean in {"both"}:
            query = query.filter(func.lower(Skill.category) == "both")
        else:
            query = query.filter((func.lower(Skill.category) == category.lower()) | (func.lower(Skill.category) == "both"))
    skills = query.all()
    return skills