"""Seed script for populating the app database with employee data."""

import argparse
import asyncio
import random
import uuid
from datetime import date, timedelta
from decimal import Decimal
from pathlib import Path

from sqlalchemy import insert

from app.core.database import AsyncSessionLocal, Base, engine
from app.enums import EmploymentType
from app.models.employee import Employee

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
FIRST_NAMES_PATH = DATA_DIR / "first_names.txt"
LAST_NAMES_PATH = DATA_DIR / "last_names.txt"

JOB_TITLES = [
    "Software Engineer",
    "Senior Software Engineer",
    "Engineering Manager",
    "Product Manager",
    "Data Scientist",
    "HR Specialist",
    "Finance Analyst",
    "Sales Executive",
    "Customer Success Manager",
    "Marketing Coordinator",
]

DEPARTMENTS = [
    "Engineering",
    "Product",
    "Data",
    "Human Resources",
    "Finance",
    "Sales",
    "Customer Success",
    "Marketing",
]

COUNTRIES = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "Australia",
    "India",
    "Brazil",
    "Singapore",
]

SALARY_RANGES = {
    "Engineering": (85000, 220000),
    "Product": (90000, 195000),
    "Data": (85000, 210000),
    "Human Resources": (60000, 130000),
    "Finance": (70000, 170000),
    "Sales": (55000, 180000),
    "Customer Success": (50000, 150000),
    "Marketing": (55000, 160000),
}


def load_names(path: Path) -> list[str]:
    return [line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def random_hire_date() -> date:
    days = random.randint(30, 365 * 10)
    return date.today() - timedelta(days=days)


def random_salary(department: str) -> Decimal:
    minimum, maximum = SALARY_RANGES.get(department, (50000, 150000))
    return Decimal(random.randint(minimum, maximum)).quantize(Decimal("1.00"))


def build_employee_payloads(count: int, first_names: list[str], last_names: list[str]) -> list[dict]:
    payloads = []

    for index in range(count):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        full_name = f"{first_name} {last_name}"
        department = random.choice(DEPARTMENTS)
        job_title = random.choice(JOB_TITLES)
        country = random.choice(COUNTRIES)
        employment_type = random.choice(list(EmploymentType)).value
        salary = random_salary(department)
        email = f"{first_name.lower()}.{last_name.lower()}.{uuid.uuid4().hex[:8]}@example.com"

        payloads.append(
            {
                "id": str(uuid.uuid4()),
                "full_name": full_name,
                "email": email,
                "job_title": job_title,
                "department": department,
                "country": country,
                "salary": salary,
                "currency": "USD",
                "employment_type": employment_type,
                "hired_at": random_hire_date(),
            }
        )

    return payloads


async def ensure_schema() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def seed(count: int) -> int:
    first_names = load_names(FIRST_NAMES_PATH)
    last_names = load_names(LAST_NAMES_PATH)
    payloads = build_employee_payloads(count, first_names, last_names)
    batch_size = 1000

    async with AsyncSessionLocal() as session:
        for offset in range(0, len(payloads), batch_size):
            batch = payloads[offset : offset + batch_size]
            await session.execute(insert(Employee), batch)
        await session.commit()

    return len(payloads)


async def main() -> None:
    parser = argparse.ArgumentParser(description="Bulk seed the employee database.")
    parser.add_argument("--count", type=int, default=1000, help="Number of employee records to create")
    args = parser.parse_args()

    await ensure_schema()
    inserted = await seed(args.count)
    print(f"Inserted {inserted} employees.")


if __name__ == "__main__":
    asyncio.run(main())
