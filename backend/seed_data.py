import os
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker

# 1. Base aur config imports
from app.database.session import Base
from app.core.config import get_settings

# 2. Aapke exact verified tables ke models import karein
from app.models.admin_user import AdminUser
from app.models.project import Project
from app.models.skill import Skill
# Baaki bache hue models ke sahi file aur class names yahan confirm kijiye:
from app.models.experience import Experience
from app.models.education import Education
from app.models.certification import Certification
from app.models.contact_message import ContactMessage  # Kuch projects me ise ContactMessage kehte hain

settings = get_settings()

# 3. Engines Setup
# Apne local SQLite file ka jo bhi naam hai (jaise local.db ya sql_app.db), use yahan replace kijiye
SQLITE_URL = "sqlite:///./portfolio.db" 
POSTGRES_URL = settings.database_url

sqlite_engine = create_engine(SQLITE_URL)
postgres_engine = create_engine(POSTGRES_URL)

SqliteSession = sessionmaker(bind=sqlite_engine)
PostgresSession = sessionmaker(bind=postgres_engine)

def migrate_table(model_class, src_session, tgt_session):
    print(f"🔄 Migrating table: {model_class.__tablename__}...")
    
    # SQLite se saara data uthayein
    rows = src_session.scalars(select(model_class)).all()
    
    if not rows:
        print(f"ℹ️ No data found in SQLite for {model_class.__tablename__}. Skipping.")
        return

    # Data copy loop
    for row in rows:
        src_session.expunge(row)  # SQLite session se detach karein
        tgt_session.merge(row)    # Postgres me data merge/insert karein
        
    tgt_session.commit()
    print(f"✅ Successfully seeded {len(rows)} rows to Voroa Cloud!")

def main():
    src = SqliteSession()
    tgt = PostgresSession()
    
    try:
        print("🚀 Data seeding starting from SQLite to Voroa Cloud...")
        
        # Ek ek karke saare tables sequential order me seed karein
        migrate_table(AdminUser, src, tgt)
        migrate_table(Skill, src, tgt)
        migrate_table(Project, src, tgt)
        migrate_table(Experience, src, tgt)
        migrate_table(Education, src, tgt)
        migrate_table(Certification, src, tgt)
        migrate_table(ContactMessage, src, tgt)
        
        print("\n🎉 Seeding complete! Saara data Mumbai Cloud server par successfully transfer ho gaya hai.")
        
    except Exception as e:
        print(f"\n❌ Seeding me error aaya: {e}")
        tgt.rollback()
    finally:
        src.close()
        tgt.close()

if __name__ == "__main__":
    main()
