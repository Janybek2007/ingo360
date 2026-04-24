"""update sales and ims constraints

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-04-24 14:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SecondarySales: добавляем distributor_id в business key
    op.drop_constraint("uq_secondary_sales_business_key", "secondary_sales", type_="unique")
    op.create_unique_constraint(
        "uq_secondary_sales_business_key",
        "secondary_sales",
        ["pharmacy_id", "sku_id", "month", "year", "indicator", "distributor_id"],
    )

    # IMS: добавляем unique business key
    op.create_unique_constraint(
        "uq_ims_business_key",
        "ims",
        ["company", "brand", "segment", "dosage", "dosage_form", "period", "molecule"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_ims_business_key", "ims", type_="unique")

    op.drop_constraint("uq_secondary_sales_business_key", "secondary_sales", type_="unique")
    op.create_unique_constraint(
        "uq_secondary_sales_business_key",
        "secondary_sales",
        ["pharmacy_id", "sku_id", "month", "year", "indicator"],
    )
