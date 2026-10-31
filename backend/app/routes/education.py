import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.education import Education
from app.schemas.education import EducationResponse

router = APIRouter(prefix="/education", tags=["education"])


@router.get("", response_model=List[EducationResponse])
def get_education(db: Session = Depends(get_db)):
    """Get all education entries ordered by display order."""
    education = db.query(Education).order_by(Education.display_order).all()
    return education