"""Business logic for employee operations."""

from typing import List, Optional, Tuple

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.employee_repo import EmployeeListFilters, EmployeeRepository
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate


class EmployeeService:
    def __init__(self) -> None:
        self.repository = EmployeeRepository()

    async def create_employee(self, db: AsyncSession, employee_create: EmployeeCreate) -> Employee:
        return await self.repository.create(db, employee_create)

    async def get_employee(self, db: AsyncSession, employee_id: str) -> Optional[Employee]:
        return await self.repository.get(db, employee_id)

    async def list_employees(
        self,
        db: AsyncSession,
        *,
        limit: int = 25,
        offset: int = 0,
        filters: Optional[EmployeeListFilters] = None,
    ) -> Tuple[List[Employee], int]:
        return await self.repository.list_and_count(
            db,
            limit=limit,
            offset=offset,
            filters=filters,
        )

    async def update_employee(self, db: AsyncSession, employee_id: str, employee_update: EmployeeUpdate) -> Optional[Employee]:
        return await self.repository.update(db, employee_id, employee_update)

    async def delete_employee(self, db: AsyncSession, employee_id: str) -> Optional[Employee]:
        return await self.repository.soft_delete(db, employee_id)
