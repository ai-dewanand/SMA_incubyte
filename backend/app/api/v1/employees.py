"""Employee API routes: CRUD endpoints for employee resources."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.employee_repo import EmployeeListFilters
from app.services.employee_service import EmployeeService
from app.schemas.employee import EmployeeCreate, EmployeeListResponse, EmployeeRead, EmployeeUpdate


router = APIRouter(prefix="/api/v1/employees", tags=["employees"])


@router.get("", response_model=EmployeeListResponse)
async def list_employees(
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    job_title: Optional[str] = Query(None),
    employment_type: Optional[str] = Query(None),
    sort_by: str = Query("full_name"),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
):
    service = EmployeeService()
    filters = EmployeeListFilters(
        search=search,
        country=country,
        department=department,
        job_title=job_title,
        employment_type=employment_type,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    employees, total = await service.list_employees(db, limit=limit, offset=offset, filters=filters)
    return EmployeeListResponse(items=employees, total=total, limit=limit, offset=offset)


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
async def create_employee(employee_create: EmployeeCreate, db: AsyncSession = Depends(get_db)):
    try:
        service = EmployeeService()
        employee = await service.create_employee(db, employee_create)
        return employee
    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists. Please use a different email address.",
        ) from e


@router.get("/{employee_id}", response_model=EmployeeRead)
async def get_employee(employee_id: str, db: AsyncSession = Depends(get_db)):
    service = EmployeeService()
    employee = await service.get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return employee


@router.patch("/{employee_id}", response_model=EmployeeRead)
async def update_employee(employee_id: str, employee_update: EmployeeUpdate, db: AsyncSession = Depends(get_db)):
    try:
        service = EmployeeService()
        employee = await service.update_employee(db, employee_id, employee_update)
        if not employee:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return employee
    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists. Please use a different email address.",
        ) from e


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str, db: AsyncSession = Depends(get_db)):
    service = EmployeeService()
    employee = await service.delete_employee(db, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
