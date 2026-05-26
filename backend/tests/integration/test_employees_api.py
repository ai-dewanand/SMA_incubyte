from datetime import date

import pytest

pytestmark = pytest.mark.asyncio


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
        "hired_at": str(date(2022, 1, 15)),
    }


async def test_employees_list_endpoint_exists(client) -> None:
    response = await client.get("/api/v1/employees")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_employees_create_endpoint_accepts_payload(client) -> None:
    response = await client.post("/api/v1/employees", json=make_employee_payload())

    assert response.status_code == 201
    payload = response.json()
    assert payload["email"] == "jane.doe@example.com"
    assert payload["is_active"] is True


async def test_employees_get_endpoint_returns_employee(client) -> None:
    create_response = await client.post("/api/v1/employees", json=make_employee_payload())
    assert create_response.status_code == 201
    employee_id = create_response.json()["id"]

    response = await client.get(f"/api/v1/employees/{employee_id}")
    assert response.status_code == 200
    assert response.json()["id"] == employee_id


async def test_employees_update_endpoint_allows_partial_update(client) -> None:
    create_response = await client.post("/api/v1/employees", json=make_employee_payload())
    assert create_response.status_code == 201
    employee_id = create_response.json()["id"]

    update_payload = {"job_title": "Senior HR Manager"}
    response = await client.patch(f"/api/v1/employees/{employee_id}", json=update_payload)

    assert response.status_code == 200
    assert response.json()["job_title"] == "Senior HR Manager"


async def test_employees_delete_endpoint_soft_deletes_employee(client) -> None:
    create_response = await client.post("/api/v1/employees", json=make_employee_payload())
    assert create_response.status_code == 201
    employee_id = create_response.json()["id"]

    delete_response = await client.delete(f"/api/v1/employees/{employee_id}")
    assert delete_response.status_code == 204

    get_response = await client.get(f"/api/v1/employees/{employee_id}")
    assert get_response.status_code == 404
