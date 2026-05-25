"""create employees table

Revision ID: 0001_create_employees_table
Revises: 
Create Date: 2026-05-26 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "0001_create_employees_table"
down_revision = None
branch_labels = None
depend_on = None


def upgrade() -> None:
    op.create_table(
        "employees",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column("full_name", sa.String(length=200), nullable=False),
        sa.Column("email", sa.String(length=254), nullable=False, unique=True),
        sa.Column("job_title", sa.String(length=150), nullable=False),
        sa.Column("department", sa.String(length=100), nullable=False),
        sa.Column("country", sa.String(length=100), nullable=False),
        sa.Column("salary", sa.Numeric(12, 2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default=sa.text("'USD'")),
        sa.Column("employment_type", sa.Enum("FULL_TIME", "PART_TIME", "CONTRACT", name="employmenttype"), nullable=False),
        sa.Column("hired_at", sa.Date(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
            server_onupdate=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.create_index("ix_employees_email", "employees", ["email"])
    op.create_index("ix_employees_job_title", "employees", ["job_title"])
    op.create_index("ix_employees_country", "employees", ["country"])


def downgrade() -> None:
    op.drop_index("ix_employees_country", table_name="employees")
    op.drop_index("ix_employees_job_title", table_name="employees")
    op.drop_index("ix_employees_email", table_name="employees")
    op.drop_table("employees")
