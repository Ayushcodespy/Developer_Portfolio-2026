import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CertificationBase(BaseModel):
    name: str
    provider: str
    type: Optional[str] = None
    score: Optional[str] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(CertificationBase):
    pass


class CertificationResponse(CertificationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True