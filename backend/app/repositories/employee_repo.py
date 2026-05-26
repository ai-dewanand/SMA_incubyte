"""Repository layer for employee persistence."""

from typing import List, Optional, Tuple

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.employee import Employee
from app.repositories.base import BaseRepository
from app.schemas.employee import EmployeeCreate, EmployeeUpdate

SORTABLE_COLUMNS = {
    "full_name": Employee.full_name,
    "email": Employee.email,
    "job_title": Employee.job_title,
    "department": Employee.department,
    "country": Employee.country,
    "salary": Employee.salary,
    "hired_at": Employee.hired_at,
}


class EmployeeListFilters:
    def __init__(
        self,
        *,
        search: Optional[str] = None,
        country: Optional[str] = None,
        department: Optional[str] = None,
        job_title: Optional[str] = None,
        employment_type: Optional[str] = None,
        sort_by: str = "full_name",
        sort_order: str = "asc",
    ) -> None:
        self.search = search.strip() if search else None
        self.country = country
        self.department = department
        self.job_title = job_title
        self.employment_type = employment_type
        self.sort_by = sort_by if sort_by in SORTABLE_COLUMNS else "full_name"
        self.sort_order = "desc" if sort_order == "desc" else "asc"


class EmployeeRepository(BaseRepository[Employee, EmployeeCreate, EmployeeUpdate]):
    def __init__(self) -> None:
        super().__init__(Employee)

    def _apply_filters(self, stmt, filters: EmployeeListFilters):
        stmt = stmt.where(Employee.is_active == True)

        if filters.country:
            stmt = stmt.where(Employee.country == filters.country)
        if filters.department:
            stmt = stmt.where(Employee.department == filters.department)
        if filters.job_title:
            stmt = stmt.where(Employee.job_title == filters.job_title)
        if filters.employment_type:
            stmt = stmt.where(Employee.employment_type == filters.employment_type)
        if filters.search:
            pattern = f"%{filters.search}%"
            stmt = stmt.where(
                or_(
                    Employee.full_name.ilike(pattern),
                    Employee.email.ilike(pattern),
                    Employee.job_title.ilike(pattern),
                    Employee.department.ilike(pattern),
                    Employee.country.ilike(pattern),
                )
            )

        sort_column = SORTABLE_COLUMNS[filters.sort_by]
        if filters.sort_order == "desc":
            stmt = stmt.order_by(sort_column.desc())
        else:
            stmt = stmt.order_by(sort_column.asc())

        return stmt

    async def get(self, db: AsyncSession, object_id: str) -> Optional[Employee]:
        stmt = select(Employee).where(
            Employee.id == object_id,
            Employee.is_active == True,
        )
        result = await db.execute(stmt)
        return result.scalars().first()

    async def count(self, db: AsyncSession, filters: EmployeeListFilters) -> int:
        stmt = select(func.count()).select_from(Employee)
        stmt = self._apply_filters(stmt, filters)
        result = await db.execute(stmt)
        return int(result.scalar_one())

    async def list(
        self,
        db: AsyncSession,
        *,
        limit: int = 25,
        offset: int = 0,
        filters: Optional[EmployeeListFilters] = None,
    ) -> List[Employee]:
        filters = filters or EmployeeListFilters()
        stmt = select(Employee)
        stmt = self._apply_filters(stmt, filters).limit(limit).offset(offset)
        result = await db.execute(stmt)
        return list(result.scalars().all())

    async def list_and_count(
        self,
        db: AsyncSession,
        *,
        limit: int = 25,
        offset: int = 0,
        filters: Optional[EmployeeListFilters] = None,
    ) -> Tuple[List[Employee], int]:
        filters = filters or EmployeeListFilters()
        total = await self.count(db, filters)
        employees = await self.list(db, limit=limit, offset=offset, filters=filters)
        return employees, total

    async def soft_delete(self, db: AsyncSession, employee_id: str) -> Optional[Employee]:
        from sqlalchemy import update

        await db.execute(
            update(Employee)
            .where(Employee.id == employee_id)
            .values(is_active=False)
        )
        await db.commit()

        result = await db.execute(select(Employee).where(Employee.id == employee_id))
        return result.scalars().first()
