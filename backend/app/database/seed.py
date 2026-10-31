import json
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.models import Project, Skill, Experience, Education, Certification, ContactMessage
import json


def seed_projects(db: Session):
    """Seed projects data."""
    projects_data = [
        {
            "title": "AI FAQ Chatbot",
            "subtitle": "RAG Based AI Application",
            "description": "Built a full-stack AI chatbot with a responsive ReactJS frontend and Python/FastAPI backend integrated with PostgreSQL for semantic document retrieval.",
            "category": "Development",
            "technologies": json.dumps(["Python", "FastAPI", "ReactJS", "PostgreSQL", "VectorDB"]),
            "features": json.dumps([
                "Retrieval-Augmented Generation (RAG)",
                "Semantic document retrieval",
                "REST APIs",
                "Context-aware responses",
                "Modular backend architecture",
                "API performance optimization",
                "Testing and debugging"
            ]),
            "github_url": "https://github.com/Ayushcodespy/FAQ-Chatbot-MPOnline.git",
            "live_url": None,
            "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
            "visual_type": "ai-chatbot",
            "featured": True,
            "display_order": 1
        },
        {
            "title": "Green & Grains Grocery Platform",
            "subtitle": "Full-Stack Grocery Platform",
            "description": "Built a full-stack grocery platform with JWT authentication, role-based access control, PostgreSQL-backed REST APIs, inventory management, order processing, and an admin dashboard.",
            "category": "Development",
            "technologies": json.dumps(["FastAPI", "React", "Flutter", "PostgreSQL"]),
            "features": json.dumps([
                "FastAPI backend",
                "React interface",
                "Flutter application",
                "PostgreSQL",
                "JWT authentication",
                "Role-based access control",
                "Inventory management",
                "Order processing",
                "Admin dashboard",
                "Real-time data handling"
            ]),
            "github_url": None,
            "live_url": None,
            "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop",
            "visual_type": "grocery-platform",
            "featured": False,
            "display_order": 2
        },
        {
            "title": "Agro-Trade Portal",
            "subtitle": "Inventory & Billing Management System",
            "description": "Developed a Django-based inventory and billing management system with secure authentication, CRUD operations, dashboards, inventory tracking, sales monitoring, and centralized business records.",
            "category": "Development",
            "technologies": json.dumps(["Django", "SQL"]),
            "features": json.dumps([
                "Django",
                "SQL",
                "Authentication",
                "CRUD operations",
                "Inventory management",
                "Billing",
                "Sales monitoring",
                "Dashboard",
                "Centralized business records",
                "Workflow automation"
            ]),
            "github_url": None,
            "live_url": None,
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            "visual_type": "inventory-dashboard",
            "featured": False,
            "display_order": 3
        }
    ]
    
    for project_data in projects_data:
        existing = db.query(Project).filter(Project.title == project_data["title"]).first()
        if not existing:
            project = Project(**project_data)
            db.add(project)
    
    db.commit()
    print("Projects seeded successfully.")


def seed_skills(db: Session):
    """Seed skills data."""
    skills_data = [
        {"name": "Python", "category": "Development", "display_order": 1},
        {"name": "SQL", "category": "Data Analysis", "display_order": 2},
        {"name": "JavaScript", "category": "Development", "display_order": 3},
        {"name": "HTML/CSS", "category": "Development", "display_order": 4},
        {"name": "Django", "category": "Development", "display_order": 1},
        {"name": "FastAPI", "category": "Development", "display_order": 2},
        {"name": "Flask", "category": "Development", "display_order": 3},
        {"name": "ReactJS", "category": "Development", "display_order": 4},
        {"name": "Pandas", "category": "Data Analysis", "display_order": 5},
        {"name": "NumPy", "category": "Data Analysis", "display_order": 6},
        {"name": "PostgreSQL", "category": "Development", "display_order": 1},
        {"name": "MySQL", "category": "Development", "display_order": 2},
        {"name": "SQLite", "category": "Development", "display_order": 3},
        {"name": "Git", "category": "Development", "display_order": 1},
        {"name": "GitHub", "category": "Development", "display_order": 2},
        {"name": "VS Code", "category": "Development", "display_order": 3},
        {"name": "PyCharm", "category": "Development", "display_order": 4},
        {"name": "MS Excel", "category": "Data Analysis", "display_order": 5},
        {"name": "Vercel", "category": "Development", "display_order": 6},
        {"name": "ChatGPT", "category": "Development", "display_order": 1},
        {"name": "OpenAI Codex", "category": "Development", "display_order": 2},
        {"name": "AI-assisted coding", "category": "Development", "display_order": 3},
        {"name": "Debugging", "category": "Development", "display_order": 4},
        {"name": "Refactoring", "category": "Development", "display_order": 5},
        {"name": "Documentation", "category": "Development", "display_order": 6}
    ]
    
    for skill_data in skills_data:
        existing = db.query(Skill).filter(Skill.name == skill_data["name"]).first()
        if not existing:
            skill = Skill(**skill_data)
            db.add(skill)
    
    db.commit()
    print("Skills seeded successfully.")


def seed_experience(db: Session):
    """Seed experience data."""
    experience_data = {
        "company": "MPOnline Limited",
        "role": "Software Developer Intern",
        "start_date": "2025-12",
        "end_date": "2026-05",
        "duration": "Dec 2025 – May 2026",
        "description": "AI + Backend + Full-Stack Development",
        "responsibilities": json.dumps([
            "Developed and implemented functional requirements for an AI-powered FAQ chatbot using Python, FastAPI, ReactJS, and PostgreSQL with Retrieval-Augmented Generation (RAG) and semantic search.",
            "Built scalable REST APIs and backend modules enabling secure data processing, efficient query handling, and production-ready features.",
            "Collaborated with the development team on debugging, performance optimization, code quality, and delivery of high-quality software solutions.",
            "Participated in technical discussions, followed coding standards, and gained practical exposure to the Software Development Life Cycle (SDLC)."
        ]),
        "technologies": json.dumps(["Python", "FastAPI", "ReactJS", "PostgreSQL", "RAG", "Semantic Search"]),
        "display_order": 1
    }
    
    existing = db.query(Experience).filter(Experience.company == experience_data["company"]).first()
    if not existing:
        experience = Experience(**experience_data)
        db.add(experience)
        db.commit()
    
    print("Experience seeded successfully.")


def seed_education(db: Session):
    """Seed education data."""
    education_data = {
        "institution": "AKS University",
        "degree": "B.Tech",
        "field": "Computer Science & Engineering",
        "location": "Satna, Madhya Pradesh",
        "start_year": "2022",
        "end_year": "2026",
        "cgpa": "7.34 / 10",
        "percentage": "73.40%",
        "description": "Computer Science, Software Development, Programming, Algorithms, Database Systems",
        "display_order": 1
    }
    
    existing = db.query(Education).filter(Education.institution == education_data["institution"]).first()
    if not existing:
        education = Education(**education_data)
        db.add(education)
        db.commit()
    
    print("Education seeded successfully.")


def seed_certifications(db: Session):
    """Seed certifications data."""
    certifications_data = [
        {
            "name": "Data Science Course",
            "provider": "CodeWithHarry",
            "type": "Course",
            "display_order": 1
        },
        {
            "name": "Junior Software Developer",
            "provider": "Skill India",
            "type": "Certification",
            "display_order": 2
        },
        {
            "name": "Python Course",
            "provider": "CodeWithHarry",
            "type": "Course",
            "display_order": 3
        }
    ]
    
    for cert_data in certifications_data:
        existing = db.query(Certification).filter(
            Certification.name == cert_data["name"],
            Certification.provider == cert_data["provider"]
        ).first()
        if not existing:
            certification = Certification(**cert_data)
            db.add(certification)
    
    db.commit()
    print("Certifications seeded successfully.")


def seed_database():
    """Seed all database tables with existing portfolio data."""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        seed_projects(db)
        seed_skills(db)
        seed_experience(db)
        seed_education(db)
        seed_certifications(db)
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()