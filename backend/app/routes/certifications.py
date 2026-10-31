import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.certification import Certification
from app.schemas.certification import CertificationResponse

router = APIRouter(prefix="/certifications", tags=["certifications"])


@router.get("", response_model=List[CertificationResponse])
def get_certifications(db: Session = Depends(get_db)):
    """Get all certifications ordered by display order."""
    certifications = db.query(Certification).order_by(Certification.display_order).all()
    return certifications