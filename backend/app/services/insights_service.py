"""Business logic for salary insights."""

from typing import Any, Dict, List, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.employee import Employee


class InsightsService:
    async def get_salary_stats(self, db: AsyncSession, country: Optional[str] = None) -> Dict[str, float]:
        stmt = select(func.min(Employee.salary), func.max(Employee.salary), func.avg(Employee.salary)).where(Employee.is_active == True)
        if country:
            stmt = stmt.where(Employee.country == country)

        result = await db.execute(stmt)
        min_v, max_v, avg_v = result.one()
        return {
            "min": float(min_v) if min_v is not None else 0.0,
            "max": float(max_v) if max_v is not None else 0.0,
            "avg": float(avg_v) if avg_v is not None else 0.0,
        }

    async def get_salary_by_title(self, db: AsyncSession, country: str, title: str) -> float:
        stmt = select(func.avg(Employee.salary)).where(Employee.is_active == True, Employee.country == country, Employee.job_title == title)
        result = await db.execute(stmt)
        avg_v = result.scalar()
        return float(avg_v) if avg_v is not None else 0.0

    async def get_top_earners(self, db: AsyncSession, country: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        stmt = select(Employee).where(Employee.is_active == True)
        if country:
            stmt = stmt.where(Employee.country == country)
        stmt = stmt.order_by(Employee.salary.desc()).limit(limit)
        result = await db.execute(stmt)
        rows = result.scalars().all()
        return [{"id": r.id, "full_name": r.full_name, "salary": float(r.salary)} for r in rows]

    async def get_department_breakdown(self, db: AsyncSession, country: Optional[str] = None) -> List[Dict[str, Any]]:
        stmt = select(Employee.department, func.avg(Employee.salary)).where(Employee.is_active == True)
        if country:
            stmt = stmt.where(Employee.country == country)
        stmt = stmt.group_by(Employee.department)
        result = await db.execute(stmt)
        return [{"department": row[0], "avg": float(row[1])} for row in result.all()]

    async def get_headcount(self, db: AsyncSession) -> List[Dict[str, Any]]:
        stmt = select(Employee.country, func.count()).where(Employee.is_active == True).group_by(Employee.country)
        result = await db.execute(stmt)
        return [{"country": row[0], "count": int(row[1])} for row in result.all()]

    async def get_salary_distribution(self, db: AsyncSession, country: Optional[str] = None, buckets: int = 10) -> Dict[str, Any]:
        # Simple histogram: fetch min/max then bucketize salaries in Python
        stats = await self.get_salary_stats(db, country=country)
        min_v = stats["min"]
        max_v = stats["max"]
        if min_v == max_v:
            return {"buckets": [ {"range": [min_v, max_v], "count": 0} ], "total": 0}

        stmt = select(Employee.salary).where(Employee.is_active == True)
        if country:
            stmt = stmt.where(Employee.country == country)
        result = await db.execute(stmt)
        salaries = [float(r[0]) for r in result.fetchall()]
        if not salaries:
            return {"buckets": [], "total": 0}

        width = (max_v - min_v) / buckets
        bucket_counts = [0] * buckets
        for s in salaries:
            idx = int((s - min_v) / width)
            if idx == buckets:
                idx = buckets - 1
            bucket_counts[idx] += 1

        bucket_list = []
        for i in range(buckets):
            lo = min_v + i * width
            hi = lo + width
            bucket_list.append({"range": [lo, hi], "count": bucket_counts[i]})

        return {"buckets": bucket_list, "total": len(salaries)}

