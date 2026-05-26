# Architecture

## System context

```
┌─────────────┐     HTTPS/JSON      ┌──────────────────┐
│  Next.js    │ ◄─────────────────► │  FastAPI         │
│  (browser)  │   /api/v1/*         │  + SQLAlchemy    │
└─────────────┘                     └────────┬─────────┘
                                             │
                                    ┌────────▼─────────┐
                                    │  SQLite (app.db) │
                                    └──────────────────┘
```

## Backend layers

```
backend/app/
├── api/v1/           # Thin route handlers (HTTP in/out)
│   ├── employees.py
│   └── insights.py
├── schemas/          # Pydantic request/response models
├── services/         # Business rules
│   ├── employee_service.py
│   └── insights_service.py
├── repositories/     # DB access (queries, CRUD)
│   └── employee_repo.py
├── models/           # SQLAlchemy ORM
├── core/             # Config, engine, session
└── main.py           # App factory, CORS, routers
```

**Dependency flow:** `API → Service → Repository → Model`

Routes validate input with Pydantic, delegate to services, and map ORM entities to response schemas. Insights aggregations live in `InsightsService` using SQLAlchemy `func` / `group_by` where possible; salary distribution uses in-memory bucketing after fetching salaries.

## Frontend structure

```
frontend/src/
├── app/
│   ├── page.tsx              # Home / navigation hub
│   ├── employees/page.tsx    # Directory + form
│   └── insights/page.tsx     # Analytics dashboard
├── components/
│   ├── employees/            # Table, form
│   ├── insights/             # Metric cards
│   ├── layout/               # AppNav
│   └── ui/                   # Alert, Spinner, etc.
└── lib/
    ├── api.ts                # Typed fetch wrappers
    └── insights.ts           # API response normalisation
```

Client components fetch from `NEXT_PUBLIC_API_URL`. Employee list state is page-driven (`page`, `pageSize`, debounced `search` / filters).

## Database

- **Engine:** `sqlite+aiosqlite` (async SQLAlchemy).
- **Migrations:** Alembic (`backend/migrations/`).
- **Seed:** `scripts/seed.py` — bulk `insert()` in 1,000-row batches.

### Employee table (conceptual)

| Column | Purpose |
|--------|---------|
| `id` | UUID PK |
| `full_name`, `email` | Identity |
| `job_title`, `department`, `country` | Org + filters |
| `salary`, `currency` | Compensation |
| `employment_type`, `hired_at` | Workforce metadata |
| `is_active` | Soft delete flag |
| `created_at`, `updated_at` | Audit |

## Key endpoints

### Employees

- `GET /api/v1/employees` — paginated, filterable list (`EmployeeListResponse`).
- `POST` / `PATCH` / `DELETE` — lifecycle with integrity check on duplicate email.

### Insights

- Aggregations over `is_active = true` rows only.
- Optional `country` query param on several insights (frontend can wire country selector later).

## Cross-cutting concerns

| Concern | Implementation |
|---------|----------------|
| CORS | `CORSMiddleware` allow-all (dev/demo) |
| Errors | HTTP 400 on duplicate email; 404 on missing employee |
| Testing | pytest async client; in-memory or file SQLite per test config |

## TDD commit narrative

The git history is structured Red → Green → Refactor:

1. Scaffold + model/migrations  
2. Unit tests → employee repo/service  
3. Integration tests → employee API  
4. Insights service + API  
5. Seed performance  
6. Frontend pages + polish  
7. Documentation (this commit)

## Deployment topology (target)

| Component | Platform |
|-----------|----------|
| API | Railway or Render |
| UI | Vercel |
| DB | SQLite volume (demo) or migrate to Postgres |

See [deployment.md](./deployment.md) for environment variables and build commands.
