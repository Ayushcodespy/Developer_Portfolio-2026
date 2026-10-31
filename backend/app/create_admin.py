import os
import sys
import getpass
from pathlib import Path

from app.core.config import get_settings
from app.database.session import Base, SessionLocal, engine
from app.models.admin_user import AdminUser
from app.security import hash_password


def main():
    settings = get_settings()
    username = settings.admin_username or os.getenv("ADMIN_USERNAME")
    password = settings.admin_password or os.getenv("ADMIN_PASSWORD")

    if not username or not password:
        if sys.stdin.isatty():
            print("=== Admin User Bootstrap ===")
            if not username:
                username = input("Enter admin username: ").strip()
            if not password:
                password = getpass.getpass("Enter admin password: ").strip()
        else:
            raise SystemExit("Error: Set ADMIN_USERNAME and ADMIN_PASSWORD before running this command.")

    if not username or not password:
        raise SystemExit("Error: Admin username and password cannot be empty.")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter_by(username=username).first()
        if existing:
            print(f"Admin user '{username}' already exists; updating password hash.")
            existing.password_hash = hash_password(password)
            existing.is_active = True
            db.commit()
            print(f"Admin user '{username}' password successfully updated.")
            return

        db.add(AdminUser(username=username, password_hash=hash_password(password), is_active=True))
        db.commit()
        print(f"Admin user '{username}' created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
