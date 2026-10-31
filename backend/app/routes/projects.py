import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.database.session import get_db
from app.models.project import Project
from app.schemas.project import ProjectResponse

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=List[ProjectResponse])
def get_projects(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all projects ordered by display order, optionally filtered by category."""
    query = db.query(Project).order_by(Project.display_order)
    if category and category.lower() != "all":
        cat_clean = category.lower().replace("-", " ")
        if cat_clean in {"data analysis", "data analyst"}:
            query = query.filter(func.lower(Project.category) == "data analysis")
        elif cat_clean in {"development", "dev"}:
            query = query.filter(func.lower(Project.category) == "development")
        else:
            query = query.filter(func.lower(Project.category) == category.lower())
    projects = query.all()
    return projects


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Get a specific project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project