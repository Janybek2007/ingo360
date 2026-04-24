"""update doctor unique constraints

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a1
Create Date: 2026-04-24 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op

revision: str = "c3d4e5f6a7b8"
down_revision: Union[str, None] = "b2c3d4e5f6a1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # GlobalDoctor: добавляем speciality_id в уникальный ключ
    op.drop_constraint("uq_global_doctor_unique", "global_doctors", type_="unique")
    op.create_unique_constraint(
        "uq_global_doctor_unique",
        "global_doctors",
        ["full_name", "medical_facility_id", "speciality_id"],
    )

    # Doctor: добавляем product_group_id в уникальный ключ
    op.drop_constraint("uq_doctor_global_company", "doctors", type_="unique")
    op.create_unique_constraint(
        "uq_doctor_global_company",
        "doctors",
        ["global_doctor_id", "company_id", "product_group_id"],
    )


def downgrade() -> None:
    op.drop_constraint("uq_doctor_global_company", "doctors", type_="unique")
    op.create_unique_constraint(
        "uq_doctor_global_company",
        "doctors",
        ["global_doctor_id", "company_id"],
    )

    op.drop_constraint("uq_global_doctor_unique", "global_doctors", type_="unique")
    op.create_unique_constraint(
        "uq_global_doctor_unique",
        "global_doctors",
        ["full_name", "medical_facility_id"],
    )
