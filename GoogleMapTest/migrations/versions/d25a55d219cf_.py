"""empty message

Revision ID: d25a55d219cf
Revises: 
Create Date: 2019-03-15 22:58:53.363982

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'd25a55d219cf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id', mysql.INTEGER(display_width=11), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('parent_category_id', mysql.INTEGER(display_width=11), server_default=sa.text("'0'"), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_parent_category_id'), 'categories', ['parent_category_id'], unique=False)
    op.create_table('suburbs',
    sa.Column('id', mysql.INTEGER(display_width=11), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('postcode', sa.String(length=4), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_suburbs_postcode'), 'suburbs', ['postcode'], unique=False)
    op.create_table('jobs',
    sa.Column('id', mysql.INTEGER(display_width=11), nullable=False),
    sa.Column('status', sa.String(length=50), server_default=sa.text("'new'"), nullable=False),
    sa.Column('suburb_id', mysql.INTEGER(display_width=11), nullable=False),
    sa.Column('category_id', mysql.INTEGER(display_width=11), nullable=False),
    sa.Column('contact_name', sa.String(length=255), nullable=False),
    sa.Column('contact_phone', sa.String(length=255), nullable=False),
    sa.Column('contact_email', sa.String(length=255), nullable=False),
    sa.Column('price', mysql.INTEGER(display_width=3), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text("'2019-01-01 00:00:00'"), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
    sa.ForeignKeyConstraint(['suburb_id'], ['suburbs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_jobs_category_id'), 'jobs', ['category_id'], unique=False)
    op.create_index(op.f('ix_jobs_suburb_id'), 'jobs', ['suburb_id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_jobs_suburb_id'), table_name='jobs')
    op.drop_index(op.f('ix_jobs_category_id'), table_name='jobs')
    op.drop_table('jobs')
    op.drop_index(op.f('ix_suburbs_postcode'), table_name='suburbs')
    op.drop_table('suburbs')
    op.drop_index(op.f('ix_categories_parent_category_id'), table_name='categories')
    op.drop_table('categories')
    # ### end Alembic commands ###