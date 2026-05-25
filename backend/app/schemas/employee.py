"""Pydantic schemas for employee payloads."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Optional

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


class EmployeeUpdate(BaseModel):
    full_name: Optional[constr(min_length=1, max_length=200)]
    email: Optional[EmailStr]
    job_title: Optional[constr(min_length=1, max_length=150)]
    department: Optional[constr(min_length=1, max_length=100)]
    country: Optional[constr(min_length=1, max_length=100)]
    salary: Optional[condecimal(gt=0, max_digits=12, decimal_places=2)]
    currency: Optional[CurrencyCode]
    employment_type: Optional[EmploymentType]
    hired_at: Optional[date]


class EmployeeRead(EmployeeBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
