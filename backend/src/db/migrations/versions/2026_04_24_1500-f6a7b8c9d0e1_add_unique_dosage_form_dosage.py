"""add unique constraints to dosage_forms and dosages

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-04-24 15:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "f6a7b8c9d0e1"
down_revision: Union[str, None] = "e5f6a7b8c9d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_unique_constraint("uq_dosage_form_name", "dosage_forms", ["name"])
    op.create_unique_constraint("uq_dosage_name", "dosages", ["name"])


def downgrade() -> None:
    op.drop_constraint("uq_dosage_name", "dosages", type_="unique")
    op.drop_constraint("uq_dosage_form_name", "dosage_forms", type_="unique")
