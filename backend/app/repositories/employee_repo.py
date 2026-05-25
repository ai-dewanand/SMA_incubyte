"""Repository layer for employee persistence."""

from typing import List, Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.employee import Employee
from app.repositories.base import BaseRepository
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


class EmployeeRepository(BaseRepository[Employee, EmployeeCreate, EmployeeUpdate]):
    def __init__(self) -> None:
        super().__init__(Employee)

    async def list(self, db: AsyncSession, limit: int = 100, offset: int = 0) -> List[Employee]:
        # By default only return active employees
        stmt = select(Employee).where(Employee.is_active == True).limit(limit).offset(offset)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def soft_delete(self, db: AsyncSession, employee_id: str) -> Optional[Employee]:
        await db.execute(
            update(Employee)
            .where(Employee.id == employee_id)
            .values(is_active=False)
        )
        await db.commit()
        return await self.get(db, employee_id)
