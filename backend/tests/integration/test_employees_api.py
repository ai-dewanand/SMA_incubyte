from datetime import date

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


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


def test_employees_list_endpoint_exists() -> None:
    response = client.get("/api/v1/employees")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_employees_create_endpoint_accepts_payload() -> None:
    response = client.post("/api/v1/employees", json=make_employee_payload())

    assert response.status_code == 201
    payload = response.json()
    assert payload["email"] == "jane.doe@example.com"
    assert payload["is_active"] is True


def test_employees_get_endpoint_returns_employee() -> None:
    create_response = client.post("/api/v1/employees", json=make_employee_payload())
    assert create_response.status_code == 201
    employee_id = create_response.json()["id"]

    response = client.get(f"/api/v1/employees/{employee_id}")
    assert response.status_code == 200
    assert response.json()["id"] == employee_id


def test_employees_update_endpoint_allows_partial_update() -> None:
    create_response = client.post("/api/v1/employees", json=make_employee_payload())
    assert create_response.status_code == 201
    employee_id = create_response.json()["id"]

    update_payload = {"job_title": "Senior HR Manager"}
    response = client.patch(f"/api/v1/employees/{employee_id}", json=update_payload)

    assert response.status_code == 200
    assert response.json()["job_title"] == "Senior HR Manager"


def test_employees_delete_endpoint_soft_deletes_employee() -> None:
    create_response = client.post("/api/v1/employees", json=make_employee_payload())
    assert create_response.status_code == 201
    employee_id = create_response.json()["id"]

    delete_response = client.delete(f"/api/v1/employees/{employee_id}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/api/v1/employees/{employee_id}")
    assert get_response.status_code == 404
