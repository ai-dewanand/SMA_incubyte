"""Pydantic schemas for employee payloads."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, constr, condecimal

from app.enums import EmploymentType


CurrencyCode = constr(min_length=3, max_length=3, pattern=r"^[A-Z]{3}$")


class EmployeeBase(BaseModel):
    full_name: constr(min_length=1, max_length=200)
    email: EmailStr
    job_title: constr(min_length=1, max_length=150)
    department: constr(min_length=1, max_length=100)
    country: constr(min_length=1, max_length=100)
    salary: condecimal(gt=0, max_digits=12, decimal_places=2)
    currency: CurrencyCode = "USD"
    employment_type: EmploymentType
    hired_at: date


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeDiff(BaseModel):
    full_name: Optional[constr(min_length=1, max_length=200)] = None
    email: Optional[EmailStr] = None
    job_title: Optional[constr(min_length=1, max_length=150)] = None
    department: Optional[constr(min_length=1, max_length=100)] = None
    country: Optional[constr(min_length=1, max_length=100)] = None
    salary: Optional[condecimal(gt=0, max_digits=12, decimal_places=2)] = None
    currency: Optional[CurrencyCode] = None
    employment_type: Optional[EmploymentType] = None
    hired_at: Optional[date] = None

    model_config = ConfigDict(extra="forbid")


class EmployeeUpdate(EmployeeDiff):
    pass


class EmployeeRead(EmployeeBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployeeListResponse(BaseModel):
    items: List[EmployeeRead]
    total: int
    limit: int
    offset: int
