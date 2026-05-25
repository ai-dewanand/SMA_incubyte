"""Pydantic schemas for employee payloads."""

from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    job_title: str
    department: str
    country: str
    salary: float
    currency: str = "USD"
    employment_type: str
    hired_at: date


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(EmployeeBase):
    pass


class EmployeeRead(EmployeeBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
