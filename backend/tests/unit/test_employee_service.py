import inspect
from datetime import date

from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.services.employee_service import EmployeeService


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


def test_employee_service_exposes_crud_methods() -> None:
    service = EmployeeService()

    expected_methods = [
        "create_employee",
        "get_employee",
        "list_employees",
        "update_employee",
        "delete_employee",
    ]

    for method_name in expected_methods:
        method = getattr(service, method_name, None)
        assert method is not None, f"Missing service method: {method_name}"
        assert callable(method), f"{method_name} should be callable"


def test_employee_service_create_employee_accepts_create_schema() -> None:
    service = EmployeeService()
    create_payload = EmployeeCreate(**make_employee_payload())

    method = getattr(service, "create_employee", None)
    assert method is not None
    signature = inspect.signature(method)
    assert "employee_create" in signature.parameters


def test_employee_service_update_employee_accepts_update_schema() -> None:
    service = EmployeeService()
    update_payload = EmployeeUpdate(email="updated@example.com")

    method = getattr(service, "update_employee", None)
    assert method is not None
    signature = inspect.signature(method)
    assert "employee_update" in signature.parameters
    assert update_payload.email == "updated@example.com"
