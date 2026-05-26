import inspect

from app.services.insights_service import InsightsService


def test_get_salary_stats_exists_and_signature() -> None:
    service = InsightsService()
    m = getattr(service, "get_salary_stats", None)
    assert m is not None and callable(m)
    sig = inspect.signature(m)
    assert "db" in sig.parameters and "country" in sig.parameters


def test_get_salary_by_title_exists_and_signature() -> None:
    service = InsightsService()
    m = getattr(service, "get_salary_by_title", None)
    assert m is not None and callable(m)
    sig = inspect.signature(m)
    assert "db" in sig.parameters and "country" in sig.parameters and "title" in sig.parameters


def test_get_top_earners_exists_and_signature() -> None:
    service = InsightsService()
    m = getattr(service, "get_top_earners", None)
    assert m is not None and callable(m)
    sig = inspect.signature(m)
    assert "db" in sig.parameters and "country" in sig.parameters and "limit" in sig.parameters


def test_get_department_breakdown_exists_and_signature() -> None:
    service = InsightsService()
    m = getattr(service, "get_department_breakdown", None)
    assert m is not None and callable(m)
    sig = inspect.signature(m)
    assert "db" in sig.parameters and "country" in sig.parameters


def test_get_headcount_exists_and_signature() -> None:
    service = InsightsService()
    m = getattr(service, "get_headcount", None)
    assert m is not None and callable(m)
    sig = inspect.signature(m)
    assert "db" in sig.parameters


def test_get_salary_distribution_exists_and_signature() -> None:
    service = InsightsService()
    m = getattr(service, "get_salary_distribution", None)
    assert m is not None and callable(m)
    sig = inspect.signature(m)
    assert "db" in sig.parameters
