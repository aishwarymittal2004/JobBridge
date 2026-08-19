# JobBridge

AI-powered job discovery & recruitment platform. Candidates upload a resume,
Gemini extracts skills and experience, JobBridge searches the web for matching
company career pages, and the community tracks response rates on each one. HR
teams search candidates by skill and reach out directly (up to 3 messages per
candidate).

**Stack:** FastAPI + SQLAlchemy + Alembic + PostgreSQL · React (Vite) + Redux
Toolkit + RTK Query + Tailwind CSS · JWT access/refresh auth · Gemini API ·
Docker.

```
jobbridge/
├── backend/         FastAPI app, models, routes, services, Alembic migrations
├── frontend/         React app (candidate + HR experiences)
└── docker-compose.yml
```

## Quick start (Docker)

```bash
cd jobbridge
cp backend/.env.example backend/.env   # then set GEMINI_API_KEY and SECRET_KEY
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API + Swagger docs: http://localhost:8000/docs
- Postgres: localhost:5432 (user/pass/db: `jobbridge`)

The backend creates all tables automatically on startup for local development.
For a real deployment, generate and run Alembic migrations instead (see below).

## Running locally without Docker

### Backend

```bash
cd backend
python -m venv .venv && source .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env   # edit DATABASE_URL to point at a local Postgres, set GEMINI_API_KEY
$env:DATABASE_URL="postgresql://postgres:aish123@localhost:5432/jobbridge"
uvicorn app.main:app --reload
```

Requires a running PostgreSQL instance matching `DATABASE_URL`. Without a
`GEMINI_API_KEY`, resume parsing falls back to a local keyword-based extractor
so the rest of the app still works for development.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8000` (see `vite.config.js`), so no
extra env var is needed for local dev.

## Database migrations (Alembic)

```bash
cd backend
alembic revision --autogenerate -m "init"
alembic upgrade head
```

## Environment variables (backend/.env)

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | JWT signing secret — set a long random value in production |
| `ACCESS_TOKEN_EXPIRE_MINUTES` / `REFRESH_TOKEN_EXPIRE_DAYS` | Token lifetimes |
| `DATABASE_URL` | PostgreSQL connection string |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | Resume-parsing AI (optional in dev — falls back gracefully) |
| `FRONTEND_ORIGIN` | Allowed CORS origin |
| `UPLOAD_DIR` / `MAX_UPLOAD_SIZE_MB` | Resume file storage |

## Key flows implemented

- **Auth** — separate candidate/HR signup & login, JWT access + refresh tokens,
  role-based route protection on both API and frontend.
- **Resume pipeline** — upload PDF/DOCX → text extraction (`pypdf`/`python-docx`)
  → Gemini structured extraction (skills, experience, education, technologies)
  → stored on the candidate's profile.
- **Career feed** — combines the candidate's target role + extracted skills,
  searches the web for matching career pages, caches results per role, and
  shows community-sourced applied/callback/interview counts and response rate.
- **Feedback system** — candidates log outcomes (applied, got response,
  interview scheduled, rejected, no response, custom) per career page.
- **HR dashboard** — search candidates by skill/role, view parsed resume
  insights, download resumes, and message candidates (hard-capped at 3
  messages per candidate, enforced server-side).

## Notes & next steps

- Web search for career pages uses DuckDuckGo's HTML endpoint with no API key
  required; it falls back to a small curated list if the search is unreachable
  (e.g. an offline sandbox), so the feed never comes back empty.
- File storage is local disk (`UPLOAD_DIR`) behind a Docker volume — swap for
  S3/GCS in production by replacing the two `open()`/`FileResponse` calls in
  `app/api/routes/candidate.py` and `hr.py`.
- Logout is stateless (client discards tokens). For hard token revocation, add
  a blocklist keyed by JWT `jti` with a TTL matching the refresh token's life.
