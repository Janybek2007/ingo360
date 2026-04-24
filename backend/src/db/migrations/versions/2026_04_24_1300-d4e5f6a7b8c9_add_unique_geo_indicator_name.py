"""add unique constraint to geo_indicator name

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-04-24 13:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "d4e5f6a7b8c9"
down_revision: Union[str, None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_unique_constraint("uq_geo_indicator_name", "geo_indicators", ["name"])


def downgrade() -> None:
    op.drop_constraint("uq_geo_indicator_name", "geo_indicators", type_="unique")
