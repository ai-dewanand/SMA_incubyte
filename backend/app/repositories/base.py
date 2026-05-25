"""Shared base repository utilities for CRUD operations."""
from __future__ import annotations

from typing import Generic, List, Optional, Type, TypeVar

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

CreateSchemaType = TypeVar("CreateSchemaType")
ModelType = TypeVar("ModelType")
UpdateSchemaType = TypeVar("UpdateSchemaType")


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]) -> None:
        self.model = model

    async def create(self, db: AsyncSession, obj_in: CreateSchemaType) -> ModelType:
        obj = self.model(**obj_in.model_dump())
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def get(self, db: AsyncSession, object_id: str) -> Optional[ModelType]:
        result = await db.execute(select(self.model).where(self.model.id == object_id))
        return result.scalars().first()

    async def list(self, db: AsyncSession, limit: int = 100, offset: int = 0) -> List[ModelType]:
        result = await db.execute(select(self.model).limit(limit).offset(offset))
        return result.scalars().all()

    async def update(self, db: AsyncSession, object_id: str, obj_in: UpdateSchemaType) -> Optional[ModelType]:
        values = obj_in.model_dump(exclude_none=True)
        if not values:
            return await self.get(db, object_id)

        await db.execute(
            update(self.model)
            .where(self.model.id == object_id)
            .values(**values)
        )
        await db.commit()
        return await self.get(db, object_id)
