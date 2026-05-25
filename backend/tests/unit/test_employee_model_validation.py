from datetime import date

import pytest
from pydantic import ValidationError

from app.schemas.employee import EmployeeCreate


def make_employee_payload() -> dict:
    return {
        "full_name": "Jane Doe",
        "email": "jane.doe@example.com",
        "job_title": "HR Manager",
        "department": "People Ops",
        "country": "USA",
        "salary": 95000.00,
        "currency": "USD",
        "employment_type": "FULL_TIME",
        "hired_at": date(2022, 1, 15),
    }


def test_employee_create_rejects_invalid_email() -> None:
    payload = make_employee_payload()
    payload["email"] = "not-a-valid-email"

    with pytest.raises(ValidationError):
        EmployeeCreate(**payload)


def test_employee_create_rejects_invalid_employment_type() -> None:
    payload = make_employee_payload()
    payload["employment_type"] = "INTERN"

    with pytest.raises(ValidationError):
        EmployeeCreate(**payload)


def test_employee_create_rejects_negative_salary() -> None:
    payload = make_employee_payload()
    payload["salary"] = -5000.00

    with pytest.raises(ValidationError):
        EmployeeCreate(**payload)


def test_employee_create_rejects_invalid_currency_code() -> None:
    payload = make_employee_payload()
    payload["currency"] = "USDX"

    with pytest.raises(ValidationError):
        EmployeeCreate(**payload)
