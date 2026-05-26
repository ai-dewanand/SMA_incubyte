from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.employees import router as employees_router
from app.api.v1.insights import router as insights_router


def create_app() -> FastAPI:
    app = FastAPI(title="Incubyte Salary Management")

    # Simple CORS for development/demo purposes
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(employees_router)
    app.include_router(insights_router)
    return app


app = create_app()
