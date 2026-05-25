"""A generic, single revision environment for Alembic."""
from alembic import op
import sqlalchemy as sa


revision = '<revision>'
down_revision = '<down_revision>'
branch_labels = None
depend_on = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
