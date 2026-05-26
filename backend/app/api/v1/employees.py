"""Employee API routes: CRUD endpoints for employee resources."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal, get_db
from app.services.employee_service import EmployeeService
from app.schemas.employee import EmployeeCreate, EmployeeRead, EmployeeUpdate


router = APIRouter(prefix="/api/v1/employees", tags=["employees"])


@router.get("", response_model=List[EmployeeRead])
async def list_employees(limit: int = 100, offset: int = 0, db: AsyncSession = Depends(get_db)):
    service = EmployeeService()
    employees = await service.list_employees(db, limit=limit, offset=offset)
    return employees


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
