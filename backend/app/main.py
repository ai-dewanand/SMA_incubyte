from fastapi import FastAPI


def create_app() -> FastAPI:
    app = FastAPI(title="SMA Incubyte Salary Management")
    return app


app = create_app()
