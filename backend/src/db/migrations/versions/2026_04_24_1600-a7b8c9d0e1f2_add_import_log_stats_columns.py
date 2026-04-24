"""add stats columns to import_logs

Revision ID: a7b8c9d0e1f2
Revises: f6a7b8c9d0e1
Create Date: 2026-04-24 16:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a7b8c9d0e1f2"
down_revision: Union[str, None] = "f6a7b8c9d0e1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("import_logs", sa.Column("imported_count", sa.Integer(), nullable=True))
    op.add_column("import_logs", sa.Column("inserted_count", sa.Integer(), nullable=True))
    op.add_column("import_logs", sa.Column("updated_count", sa.Integer(), nullable=True))
    op.add_column("import_logs", sa.Column("skipped_count", sa.Integer(), nullable=True))
    op.add_column("import_logs", sa.Column("deduplicated_count", sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column("import_logs", "deduplicated_count")
    op.drop_column("import_logs", "skipped_count")
    op.drop_column("import_logs", "updated_count")
    op.drop_column("import_logs", "inserted_count")
    op.drop_column("import_logs", "imported_count")
