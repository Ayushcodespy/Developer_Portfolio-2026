from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.setting import SiteSetting, DEFAULT_RESUME_URL

router = APIRouter(tags=["settings"])


@router.get("/settings/resume")
@router.get("/resume")
def get_public_resume(db: Session = Depends(get_db)):
    setting = db.query(SiteSetting).filter(SiteSetting.key == "resume_url").first()
    if not setting:
        return {"resume_url": DEFAULT_RESUME_URL}
    return {"resume_url": setting.value}

