from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from app.database.session import Base

DEFAULT_RESUME_URL = "https://drive.google.com/file/d/138oZq3lHvm-3PsaHVz7hmR0SrOmvs_1G/view?usp=sharing"


class SiteSetting(Base):
    __tablename__ = "site_settings"

    key = Column(String(100), primary_key=True, index=True)
    value = Column(Text, nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

