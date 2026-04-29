"""add pharmacies covering index for tertiary sales report

Revision ID: c1d2e3f4a5b6
Revises: b8c9d0e1f2a3
Create Date: 2026-04-28 10:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "c1d2e3f4a5b6"
down_revision: Union[str, Sequence[str], None] = "b8c9d0e1f2a3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Covering index: позволяет index-only scan при hash join в отчёте
    # tertiary/secondary sales вместо seq scan по 16k строк
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_pharmacies_covering_report
        ON pharmacies (id)
        INCLUDE (name, geo_indicator_id)
    """)


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_pharmacies_covering_report")
