"""ORM model placeholder for employee data."""

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, Numeric, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(254), nullable=False, unique=True, index=True)
    job_title = Column(String(150), nullable=False, index=True)
    department = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False, index=True)
    salary = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    employment_type = Column(String(50), nullable=False)
    hired_at = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
