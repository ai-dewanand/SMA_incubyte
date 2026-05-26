# Deployment Notes

This document covers deploying the **Incubyte Salary Management** demo: FastAPI backend + Next.js frontend.

## Overview

| Component | Recommended | Fallback |
|-----------|-------------|----------|
| Backend | [Railway](https://railway.app) | [Render](https://render.com) (no credit card on free tier) |
| Frontend | [Vercel](https://vercel.com) | Any static/Node host |
| Database | SQLite on persistent volume (demo) | PostgreSQL for production |

> **Note:** Railway may require a credit card on the free tier. If blocked, use Render for the API or a single Docker Compose stack with a public tunnel (e.g. ngrok) for demos.

---

## Backend (Railway)

### 1. Prepare the service

- **Root directory:** `backend`
- **Start command:**
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
- **Build command** (if using Nixpacks / Dockerfile):
  ```bash
  pip install -r requirements.txt
  ```

### 2. Environment variables

| Variable | Example | Notes |
|----------|---------|-------|
| `PORT` | `8000` | Set by Railway |
| `DATABASE_URL` | `sqlite+aiosqlite:///./data/app.db` | Or Postgres URL for production |

Mount a **volume** at `backend/data` if using SQLite so data survives redeploys.

### 3. Database setup

On first deploy (one-off command or release phase):

```bash
cd backend && alembic upgrade head
python -m scripts.seed --count 10000
```

### 4. CORS

Update `app/main.py` `allow_origins` to your Vercel URL in production:

```python
allow_origins=["https://your-app.vercel.app"]
```

### 5. Health check

- Path: `GET /health` → `{"status": "ok"}` (or `/docs` for Swagger).

---

## Backend (Render alternative)

1. New **Web Service** → connect repo, set root to `backend`.
2. **Build:** `pip install -r requirements.txt`
3. **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add a **persistent disk** for `data/` if using SQLite.
5. Run migrations + seed via Render shell.

---

## Frontend (Vercel)

### 1. Project settings

- **Root directory:** `frontend`
- **Framework preset:** Next.js
- **Build command:** `npm run build`
- **Output:** default (`.next`)

### 2. Environment variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.railway.app` (or Render URL) |

Redeploy after changing env vars.

### 3. Verify

- Home, `/employees`, and `/insights` load.
- Browser network tab shows API calls to the deployed backend (not `localhost`).

---

## Local production smoke test

```bash
# Backend
cd backend
uvicorn app.main:app --port 8000

# Frontend
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run build
npm run start
```

---

## Docker Compose (optional fallback)

Minimal `docker-compose.yml` pattern:

- Service `api`: build `backend/`, expose `8000`, volume for `data/`.
- Service `web`: build `frontend/` with build-arg `NEXT_PUBLIC_API_URL=http://api:8000`.

Use ngrok or similar to expose `web` for external demos if not using Vercel.

---

## PostgreSQL migration (production)

For real deployments, replace SQLite:

1. Set `DATABASE_URL=postgresql+asyncpg://...` in config.
2. Run Alembic migrations against Postgres.
3. Re-run seed or migrate data.
4. Ensure connection pooling (e.g. `pool_size`, `max_overflow`) on the SQLAlchemy engine.

---

## Checklist before sharing the demo

- [ ] Backend `/docs` loads
- [ ] Seed completed (`--count` as needed)
- [ ] `NEXT_PUBLIC_API_URL` set on Vercel
- [ ] CORS allows frontend origin
- [ ] Employee list shows correct `total` with pagination
- [ ] Insights dashboard loads all cards

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Frontend “Unable to reach API” | Check `NEXT_PUBLIC_API_URL` and CORS |
| Only 100 employees visible | Restart backend after pagination update; hard-refresh browser |
| Insights Fast Refresh errors | `rm -rf frontend/.next && npm run dev` |
| Empty database after redeploy | SQLite file not on persistent volume; re-seed |
