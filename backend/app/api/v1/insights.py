"""Insights API routes implementing salary analytics endpoints."""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.insights_service import InsightsService


router = APIRouter(prefix="/api/v1/insights", tags=["insights"])


@router.get("/salary-stats")
async def salary_stats(country: Optional[str] = Query(None), db: AsyncSession = Depends(get_db)):
	service = InsightsService()
	return await service.get_salary_stats(db, country=country)


@router.get("/salary-by-title")
async def salary_by_title(country: str = Query(...), title: str = Query(...), db: AsyncSession = Depends(get_db)):
	service = InsightsService()
	avg = await service.get_salary_by_title(db, country=country, title=title)
	return {"avg": avg}


@router.get("/top-earners")
async def top_earners(country: Optional[str] = Query(None), limit: int = Query(10), db: AsyncSession = Depends(get_db)):
	service = InsightsService()
	return await service.get_top_earners(db, country=country, limit=limit)


@router.get("/department-breakdown")
async def department_breakdown(country: Optional[str] = Query(None), db: AsyncSession = Depends(get_db)):
	service = InsightsService()
	return await service.get_department_breakdown(db, country=country)


@router.get("/headcount")
async def headcount(db: AsyncSession = Depends(get_db)):
	service = InsightsService()
	return await service.get_headcount(db)


@router.get("/salary-distribution")
async def salary_distribution(country: Optional[str] = Query(None), buckets: int = Query(10), db: AsyncSession = Depends(get_db)):
	service = InsightsService()
	return await service.get_salary_distribution(db, country=country, buckets=buckets)
