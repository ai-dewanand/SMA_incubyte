"""ORM model for employee data."""

from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, Date, DateTime, Enum, Numeric, String, func

from ..core.database import Base
from ..enums import EmploymentType


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()), index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(254), nullable=False, unique=True, index=True)
    job_title = Column(String(150), nullable=False, index=True)
    department = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False, index=True)
    salary = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    employment_type = Column(Enum(EmploymentType), nullable=False)
    hired_at = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False, server_default="1")
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    def __repr__(self) -> str:
        return f"<Employee id={self.id} email={self.email} name={self.full_name}>"
