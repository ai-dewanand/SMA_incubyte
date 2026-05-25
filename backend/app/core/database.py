from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from .config import settings


Base = declarative_base()
engine: AsyncEngine = create_async_engine(settings.database_url, future=True, echo=False)
AsyncSession = sessionmaker(engine, class_=None, expire_on_commit=False)
