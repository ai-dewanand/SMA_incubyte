import pytest

pytestmark = pytest.mark.asyncio


async def test_salary_stats_endpoint_exists(client):
    response = await client.get("/api/v1/insights/salary-stats")
    assert response.status_code == 200
    data = response.json()
    assert "min" in data and "max" in data and "avg" in data


async def test_salary_by_title_endpoint_requires_params(client):
    # missing required params should return 422
    response = await client.get("/api/v1/insights/salary-by-title")
    assert response.status_code == 422


async def test_top_earners_endpoint_returns_list(client):
    response = await client.get("/api/v1/insights/top-earners")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_department_breakdown_endpoint_returns_list(client):
    response = await client.get("/api/v1/insights/department-breakdown")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_headcount_endpoint_returns_list(client):
    response = await client.get("/api/v1/insights/headcount")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_salary_distribution_returns_structure(client):
    response = await client.get("/api/v1/insights/salary-distribution")
    assert response.status_code == 200
    data = response.json()
    assert "buckets" in data and "total" in data
