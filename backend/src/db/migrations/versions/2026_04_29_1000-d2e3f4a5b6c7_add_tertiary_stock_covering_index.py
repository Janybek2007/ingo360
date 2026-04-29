"""add tertiary stock covering index for get_stock_report

Revision ID: d2e3f4a5b6c7
Revises: c1d2e3f4a5b6
Create Date: 2026-04-29 10:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "d2e3f4a5b6c7"
down_revision: Union[str, Sequence[str], None] = "c1d2e3f4a5b6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Частичный покрывающий индекс для get_stock_report.
    # Устраняет seq scan 25K блоков с диска: фильтрует по indicator + year,
    # предоставляет sku_id/pharmacy_id/distributor_id/month для join и GROUP BY,
    # packages/amount для агрегации — всё из индекса без обращения к heap.
    op.execute("""
        CREATE INDEX IF NOT EXISTS idx_tertiary_stock_covering_partial
        ON tertiary_sales_and_stock (year, sku_id, pharmacy_id, distributor_id, month)
        INCLUDE (packages, amount)
        WHERE indicator = 'Остаток в аптеке'
    """)


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_tertiary_stock_covering_partial")
