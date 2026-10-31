import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.database.session import engine

def reset_sequences():
    if "postgres" not in str(engine.url):
        print("Not PostgreSQL, skipping sequence reset.")
        return
    tables = ['admin_users', 'projects', 'skills', 'experience', 'education', 'certifications', 'contact_messages']
    with engine.connect() as conn:
        for table in tables:
            try:
                sql = text(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), coalesce((SELECT max(id) FROM {table}), 0) + 1, false);")
                conn.execute(sql)
                conn.commit()
                print(f"Sequence reset for {table}")
            except Exception as e:
                print(f"Error for {table}: {e}")

if __name__ == "__main__":
    reset_sequences()

