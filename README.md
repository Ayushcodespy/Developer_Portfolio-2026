# Ayush Patel — Digital Developer Universe

A scalable foundation for a premium, 3D portfolio. This phase provides routing, a design system, reusable UI primitives, a local data layer, and a FastAPI health service—without implementing portfolio sections or the 3D experience.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, Framer Motion, GSAP, Three.js / React Three Fiber / Drei, Lucide
- Backend: FastAPI, SQLAlchemy, PostgreSQL-ready configuration, Pydantic Settings

## Setup

Copy `.env.example` to `.env` in the repository root and adjust values when required.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The health endpoint is available at `http://localhost:8000/health`.

## Environment variables

- `VITE_API_BASE_URL`: FastAPI base URL used by the frontend.
- `DATABASE_URL`: PostgreSQL connection string reserved for future models.
- `SECRET_KEY`: Reserved for future authentication.
- `FRONTEND_URL`: Allowed local frontend origin for CORS.
