import sys
import sqlite3
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app.core.config import get_settings
from app.database.session import SessionLocal
from app.models import Project, Skill

DATA_ANALYSIS_SKILL_NAMES = {
    "sql",
    "pandas",
    "numpy",
    "ms excel",
    "excel",
    "microsoft excel",
    "matplotlib",
    "seaborn",
    "power bi",
    "python for data analysis",
}

def migrate_sqlalchemy():
    settings = get_settings()
    print(f"Starting migration on configured DB ({settings.database_url})...")
    db = SessionLocal()
    try:
        projects = db.query(Project).all()
        proj_updated = 0
        for p in projects:
            cat_lower = (p.category or "").lower().strip()
            if "data" in cat_lower and "anal" in cat_lower:
                new_cat = "Data Analysis"
            else:
                new_cat = "Development"
            if p.category != new_cat:
                p.category = new_cat
                proj_updated += 1
        
        skills = db.query(Skill).all()
        skills_updated = 0
        for s in skills:
            name_clean = s.name.lower().strip()
            cat_lower = (s.category or "").lower().strip()
            if name_clean in DATA_ANALYSIS_SKILL_NAMES or ("data" in cat_lower and "anal" in cat_lower):
                new_cat = "Data Analysis"
            else:
                new_cat = "Development"
            if s.category != new_cat:
                s.category = new_cat
                skills_updated += 1

        db.commit()
        print(f"Configured DB Migration Successful: {proj_updated} projects updated, {skills_updated} skills updated.")
    except Exception as e:
        db.rollback()
        print(f"Error migrating configured DB: {e}")
    finally:
        db.close()

def migrate_sqlite_file(sqlite_path):
    p = Path(sqlite_path)
    if not p.exists():
        print(f"SQLite file {sqlite_path} does not exist.")
        return
    print(f"Starting direct migration on SQLite file: {sqlite_path}...")
    conn = sqlite3.connect(sqlite_path)
    cur = conn.cursor()
    cur.execute("SELECT id, title, category FROM projects")
    projs = cur.fetchall()
    proj_updated = 0
    for pid, title, cat in projs:
        cat_lower = (cat or "").lower()
        new_cat = "Data Analysis" if ("data" in cat_lower and "anal" in cat_lower) else "Development"
        if cat != new_cat:
            cur.execute("UPDATE projects SET category = ? WHERE id = ?", (new_cat, pid))
            proj_updated += 1

    cur.execute("SELECT id, name, category FROM skills")
    skills = cur.fetchall()
    skills_updated = 0
    for sid, name, cat in skills:
        name_clean = name.lower().strip()
        cat_lower = (cat or "").lower().strip()
        new_cat = "Data Analysis" if (name_clean in DATA_ANALYSIS_SKILL_NAMES or ("data" in cat_lower and "anal" in cat_lower)) else "Development"
        if cat != new_cat:
            cur.execute("UPDATE skills SET category = ? WHERE id = ?", (new_cat, sid))
            skills_updated += 1

    conn.commit()
    conn.close()
    print(f"SQLite file Migration Successful: {proj_updated} projects updated, {skills_updated} skills updated.")

if __name__ == "__main__":
    migrate_sqlalchemy()
    sqlite_file = backend_dir / "portfolio.db"
    migrate_sqlite_file(sqlite_file)

