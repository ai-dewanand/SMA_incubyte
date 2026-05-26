import asyncio

# Ensure models are imported so they are registered on the metadata
import app.models.employee  # noqa: F401

from app.core.database import engine, Base


async def main() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(main())
