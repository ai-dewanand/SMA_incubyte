from pathlib import Path


class Settings:
    project_name: str = "SMA Incubyte Backend"
    database_url: str = f"sqlite:///{Path(__file__).resolve().parents[2] / 'data' / 'app.db'}"


settings = Settings()
