"""Repository layer for employee persistence."""

from typing import List, Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


class EmployeeRepository:
    async def create(self, db: AsyncSession, employee_create: EmployeeCreate) -> Employee:
        employee = Employee(**employee_create.model_dump())
        db.add(employee)
        await db.commit()
        await db.refresh(employee)
        return employee

    async def get(self, db: AsyncSession, employee_id: str) -> Optional[Employee]:
        result = await db.execute(select(Employee).where(Employee.id == employee_id))
        return result.scalars().first()

    async def list(self, db: AsyncSession, limit: int = 100, offset: int = 0) -> List[Employee]:
        # By default only return active employees
        stmt = select(Employee).where(Employee.is_active == True).limit(limit).offset(offset)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def update(self, db: AsyncSession, employee_id: str, employee_update: EmployeeUpdate) -> Optional[Employee]:
        values = employee_update.model_dump(exclude_none=True)
        if not values:
            return await self.get(db, employee_id)

        await db.execute(
            update(Employee)
            .where(Employee.id == employee_id)
            .values(**values)
        )
        await db.commit()
        return await self.get(db, employee_id)

    async def soft_delete(self, db: AsyncSession, employee_id: str) -> Optional[Employee]:
        await db.execute(
            update(Employee)
            .where(Employee.id == employee_id)
            .values(is_active=False)
        )
        await db.commit()
        return await self.get(db, employee_id)
