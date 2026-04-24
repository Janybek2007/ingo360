"""Add expires_at to password_setup_tokens

Revision ID: b8c9d0e1f2a3
Revises: a7b8c9d0e1f2
Create Date: 2026-04-24 17:00:00.000000

"""
import sqlalchemy as sa
from alembic import op

revision = "b8c9d0e1f2a3"
down_revision = "a7b8c9d0e1f2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    result = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.columns "
            "WHERE table_name='password_setup_tokens' AND column_name='expires_at'"
        )
    )
    if result.fetchone() is None:
        op.add_column(
            "password_setup_tokens",
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        )


def downgrade() -> None:
    conn = op.get_bind()
    result = conn.execute(
        sa.text(
            "SELECT 1 FROM information_schema.columns "
            "WHERE table_name='password_setup_tokens' AND column_name='expires_at'"
        )
    )
    if result.fetchone() is not None:
        op.drop_column("password_setup_tokens", "expires_at")