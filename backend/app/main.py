from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes.health import router as health_router
from app.routes.projects import router as projects_router
from app.routes.skills import router as skills_router
from app.routes.experience import router as experience_router
from app.routes.education import router as education_router
from app.routes.certifications import router as certifications_router
from app.routes.contact import router as contact_router
from app.routes.admin import router as admin_router
from app.routes.settings import router as settings_router
from app.database.session import Base, engine
from app.models.admin_user import AdminUser
from app.models.certification import Certification
from app.models.education import Education
from app.models.experience import Experience
from app.models.project import Project
from app.models.skill import Skill
from app.models.contact_message import ContactMessage
from app.models.setting import SiteSetting

settings = get_settings()
app = FastAPI(title="Ayush Patel Portfolio API", version="0.1.0")

allowed_origins = [settings.frontend_url]
if "localhost" in settings.frontend_url:
    alt = settings.frontend_url.replace("localhost", "127.0.0.1")
    if alt not in allowed_origins:
        allowed_origins.append(alt)
elif "127.0.0.1" in settings.frontend_url:
    alt = settings.frontend_url.replace("127.0.0.1", "localhost")
    if alt not in allowed_origins:
        allowed_origins.append(alt)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(experience_router, prefix="/api")
app.include_router(education_router, prefix="/api")
app.include_router(certifications_router, prefix="/api")
app.include_router(contact_router, prefix="/api")
app.include_router(settings_router, prefix="/api")
app.include_router(admin_router, prefix="/api")

@app.on_event("startup")
def ensure_admin_table():
    # Base.metadata.create_all(bind=engine, tables=[AdminUser.__table__])
    Base.metadata.create_all(bind=engine)
