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
    payload = response.json()
    assert isinstance(payload, dict)
    assert "items" in payload
    assert "total" in payload
    assert "limit" in payload
    assert "offset" in payload
    assert isinstance(payload["items"], list)


async def test_employees_list_supports_pagination(client) -> None:
    for index in range(3):
        payload = make_employee_payload()
        payload["email"] = f"user{index}@example.com"
        create_response = await client.post("/api/v1/employees", json=payload)
        assert create_response.status_code == 201

    response = await client.get("/api/v1/employees", params={"limit": 2, "offset": 0})
    assert response.status_code == 200
    page_one = response.json()
    assert len(page_one["items"]) == 2
    assert page_one["total"] >= 3

    response = await client.get("/api/v1/employees", params={"limit": 2, "offset": 2})
    page_two = response.json()
    assert len(page_two["items"]) >= 1
    assert page_one["items"][0]["id"] != page_two["items"][0]["id"]


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
