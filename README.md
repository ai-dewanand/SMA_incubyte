# Incubyte Salary Management

A minimal, end-to-end salary management tool for HR managers. Manage employee records, run workforce analytics, and operate on datasets scaled to tens or hundreds of thousands of rows with server-side pagination.

## Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11+, FastAPI, SQLAlchemy, Alembic |
| Database | SQLite (file-based, zero infra for local demo) |
| Frontend | Next.js 14 (App Router), TypeScript |
| Testing | pytest, pytest-cov, httpx |

## Repository layout

```
├── backend/          # FastAPI API, migrations, seed script, tests
├── frontend/         # Next.js dashboard
├── artifacts/        # Design notes, architecture, deployment, prompts log
└── README.md
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Apply schema (Alembic or create_tables)
alembic upgrade head

# Seed data (default 1,000; use --count for 10k+)
python -m scripts.seed --count 10000

# Run API
uvicorn app.main:app --reload --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)  
Health check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Frontend

```bash
cd frontend
npm install

# Point at local API (optional; defaults to localhost:8000)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

## Features

### Employee directory (`/employees`)

- Server-side pagination (25 / 50 / 100 per page)
- Search across name, email, title, department, country
- Filters: country, department, job title, employment type
- Create, edit, and soft-delete employees (full-width form)

### Insights dashboard (`/insights`)

- Salary statistics (min / max / avg)
- Headcount by country
- Department salary breakdown
- Top earners
- Salary distribution histogram

## API overview

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/employees` | Paginated list (`limit`, `offset`, `search`, filters) |
| POST | `/api/v1/employees` | Create employee |
| GET | `/api/v1/employees/{id}` | Get one employee |
| PATCH | `/api/v1/employees/{id}` | Partial update |
| DELETE | `/api/v1/employees/{id}` | Soft delete (`is_active=false`) |

List response shape:

```json
{
  "items": [...],
  "total": 100432,
  "limit": 25,
  "offset": 0
}
```

### Insights

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/insights/salary-stats` | Min / max / avg salary |
| `GET /api/v1/insights/salary-by-title` | Avg by job title + country |
| `GET /api/v1/insights/top-earners` | Top earners (`limit`, optional `country`) |
| `GET /api/v1/insights/department-breakdown` | Avg salary per department |
| `GET /api/v1/insights/headcount` | Employee count per country |
| `GET /api/v1/insights/salary-distribution` | Histogram buckets |

## Testing

```bash
cd backend
pytest tests/ -v --cov=app --cov-report=term-missing
```

Integration tests cover employee CRUD and insights endpoints. Unit tests cover services, repositories, and model validation.

## Seeding performance

The seed script uses SQLAlchemy Core bulk `insert()` in batches of 1,000 rows. Example:

```bash
cd backend
python -m scripts.seed --count 10000
```

Expected: under ~5 seconds for 10,000 rows on a typical laptop.

## Environment variables

| Variable | Where | Default |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Frontend | `http://localhost:8000` |
| `DATABASE_URL` | Backend (optional) | SQLite file at `backend/data/app.db` |

## Deployment

See [artifacts/deployment.md](artifacts/deployment.md) for Railway (backend), Vercel (frontend), and fallback options.

## Assessment artifacts

- [Design notes](artifacts/design-notes.md)
- [Architecture](artifacts/architecture.md)
- [Deployment](artifacts/deployment.md)
- [Prompts log](artifacts/prompts-log.md)

## Design decisions (summary)

- **USD-only salaries** for simplicity; `currency` field defaults to `USD`.
- **Soft delete** via `is_active=false` so HR can recover mistaken deletions.
- **Server-side pagination** for large directories (100k+ rows) instead of loading all records in the browser.

## License

Assessment / demo project.
