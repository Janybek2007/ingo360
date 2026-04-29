import os
from pathlib import Path
from typing import TYPE_CHECKING, Any, AsyncIterator
from uuid import uuid4

from sqlalchemy import Float, Numeric, case, cast, func, or_, select

from src.db.models import (
    SKU,
    Brand,
    Company,
    Distributor,
    ImportLogs,
    PrimarySalesAndStock,
    ProductGroup,
    PromotionType,
)
from src.import_fields import sale
from src.mapping.dimension_mapping.sale import BASE_SALE_DIMENSTION_MAPPING
from src.mapping.sales import primary_sales_mapping
from src.schemas import sale as sale_schema
from src.schemas.base_filter import PaginatedResponse
from src.services.base import BaseService, ModelType
from src.services.sale.utils import (
    RelationSpec,
    apply_sale_sku_company_filters,
    create_or_update_sale,
    import_sales_from_excel,
    normalize_indicator_for_sale,
)
from src.utils.build_dimensions import build_dimensions
from src.utils.build_period_key import build_period_key
from src.utils.build_period_values import build_period_values
from src.utils.indicator_resolver import (
    PRIMARY_SALES_VALUES,
    PRIMARY_STOCK_VALUES,
    normalize_primary_indicator,
)
from src.utils.list_query_helper import (
    InOrNullSpec,
    ListQueryHelper,
    NumberTypedSpec,
    SearchSpec,
)

if TYPE_CHECKING:
    from fastapi import UploadFile
    from sqlalchemy.ext.asyncio import AsyncSession


class PrimarySalesAndStockService(
    BaseService[
        PrimarySalesAndStock,
        sale_schema.PrimarySalesAndStockCreate,
        sale_schema.PrimarySalesAndStockUpdate,
    ]
):
    async def create(
        self,
        session: "AsyncSession",
        obj_in: sale_schema.PrimarySalesAndStockCreate,
        load_options: list[Any] | None = None,
    ):
        return await create_or_update_sale(
            session=session,
            model=self.model,
            data=obj_in.model_dump(),
            sale_type="primary",
            key_fields=("distributor_id", "sku_id", "month", "year", "indicator"),
            constraint_name="uq_primary_sales_business_key",
            load_options=load_options,
        )

    async def update(
        self,
        session: "AsyncSession",
        item_id: int,
        obj_in: sale_schema.PrimarySalesAndStockUpdate,
        load_options: list[Any] | None = None,
    ):
        db_obj = await self.get_or_404(session, item_id)
        update_data = obj_in.model_dump(exclude_unset=True)
        if "indicator" in update_data and update_data["indicator"] is not None:
            update_data["indicator"] = normalize_indicator_for_sale(
                "primary", update_data["indicator"]
            )
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await session.commit()
        await session.refresh(db_obj)
        return db_obj

    async def import_sales(
        self,
        session: "AsyncSession",
        file: "UploadFile",
        user_id: int,
        batch_size: int = 2000,
    ):
        from src.db.models.excel_tasks import ExcelTaskType
        from src.tasks.sale_imports import import_sales_task
        from src.tasks.utils import create_excel_task_record

        upload_dir = Path("temp")
        upload_dir.mkdir(exist_ok=True)
        file_id = str(uuid4())

        file_path = upload_dir / f"{file_id}_{file.filename}"

        try:
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)

            task = import_sales_task.delay(
                file_path=str(file_path),
                user_id=user_id,
                service_path="src.services.sale.PrimarySalesAndStockService",
                model_path="src.db.models.PrimarySalesAndStock",
                batch_size=batch_size,
            )

            await create_excel_task_record(
                task_id=task.id,
                started_by=user_id,
                file_path="",
                task_type=ExcelTaskType.IMPORT,
            )

            return {"task_id": task.id}
        except Exception:
            if file_path.exists():
                os.remove(file_path)
            raise

    async def _import_excel_from_file(
        self,
        session: "AsyncSession",
        file_path: str,
        user_id: int,
        batch_size: int = 10_000,
    ):
        try:
            return await import_sales_from_excel(
                session=session,
                file_path=file_path,
                user_id=user_id,
                batch_size=batch_size,
                model=self.model,
                import_log_model=ImportLogs,
                target_table="Первичные продажи",
                required_fields=sale.primary_sales_fields,
                mapping=primary_sales_mapping,
                key_fields=(
                    "distributor_id",
                    "sku_id",
                    "month",
                    "year",
                    "indicator",
                ),
                constraint_name="uq_primary_sales_business_key",
                relations=[
                    RelationSpec(
                        model=Distributor,
                        name_key="дистрибьютор",
                        missing_label="дистрибьютор",
                        id_field="distributor_id",
                    )
                ],
                get_id_map=self.get_id_map,
                normalize_indicator=normalize_primary_indicator,
            )
        finally:
            pass

    async def get_multi(
        self,
        session: "AsyncSession",
        filters: sale_schema.PrimarySalesAndStockListRequest | None = None,
        load_options: list[Any] | None = None,
    ) -> PaginatedResponse[sale_schema.PrimarySalesAndStockResponse]:
        stmt = select(self.model)

        if load_options:
            stmt = stmt.options(*load_options)

        sort_map = {
            "distributor": self.model.distributor_id,
            "brand": SKU.brand_id,
            "sku": self.model.sku_id,
            "month": self.model.month,
            "year": self.model.year,
            "packages": self.model.packages,
            "amount": self.model.amount,
            "company": Company.name,
        }
        stmt = ListQueryHelper.apply_sorting_with_default(
            stmt,
            getattr(filters, "sort_by", None),
            getattr(filters, "sort_order", None),
            sort_map,
            self.model.created_at.desc(),
        )

        if filters:
            stmt = ListQueryHelper.apply_specs(
                stmt,
                [
                    InOrNullSpec(self.model.distributor_id, filters.distributor_ids),
                    InOrNullSpec(self.model.sku_id, filters.sku_ids),
                    InOrNullSpec(self.model.month, filters.months),
                    InOrNullSpec(self.model.quarter, filters.quarters),
                    NumberTypedSpec(self.model.year, filters.year),
                    NumberTypedSpec(self.model.packages, filters.packages),
                    NumberTypedSpec(self.model.amount, filters.amount),
                ],
            )

            stmt = apply_sale_sku_company_filters(
                stmt, filters, self.model, normalize_primary_indicator
            )

            # Count before pagination
            count_stmt = select(func.count()).select_from(stmt.subquery())
            total_count = await session.scalar(count_stmt)

            stmt = ListQueryHelper.apply_pagination(stmt, filters.limit, filters.offset)
        else:
            count_stmt = select(func.count()).select_from(stmt.subquery())
            total_count = await session.scalar(count_stmt)

        result = await session.execute(stmt)

        items = result.unique().scalars().all()

        hasPrev = filters.offset > 0 if filters else False
        hasNext = len(items) == filters.limit if filters and filters.limit else False

        return PaginatedResponse(
            result=items,
            hasPrev=hasPrev,
            hasNext=hasNext,
            count=total_count,
        )

    async def iter_multi(
        self,
        session: "AsyncSession",
        load_options: list[Any] | None = None,
        chunk_size: int = 1000,
    ) -> AsyncIterator[ModelType]:
        stmt = select(self.model)

        if load_options:
            stmt = stmt.options(*load_options)

        stmt = ListQueryHelper.apply_sorting_with_created(
            stmt,
            self.model.created_at.desc(),
        )

        stream = await session.stream_scalars(
            stmt.execution_options(yield_per=chunk_size)
        )
        async for item in stream:
            yield item

    @staticmethod
    async def get_shipment_stock_report(
        session: "AsyncSession",
        indicator: tuple,
        company_id: int | None,
        filters: sale_schema.ShipmentStockFilter | None = None,
    ):
        period_key = build_period_key(filters.group_by_period, PrimarySalesAndStock)
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )

        select_fields, group_by_fields, search_cols = build_dimensions(
            BASE_SALE_DIMENSTION_MAPPING, filters.group_by_dimensions
        )

        base_stmt = (
            select(
                *select_fields,
                period_key.label("period"),
                func.sum(PrimarySalesAndStock.packages).label("packages"),
                func.round(func.sum(PrimarySalesAndStock.amount)).label("amount"),
            )
            .select_from(PrimarySalesAndStock)
            .join(SKU, PrimarySalesAndStock.sku_id == SKU.id)
            .join(Brand, SKU.brand_id == Brand.id)
            .join(PromotionType, SKU.promotion_type_id == PromotionType.id)
            .join(ProductGroup, SKU.product_group_id == ProductGroup.id)
            .join(Distributor, PrimarySalesAndStock.distributor_id == Distributor.id)
            .where(
                PrimarySalesAndStock.indicator.in_(
                    [normalize_primary_indicator(v) for v in indicator]
                ),
            )
        )

        if company_id is not None:
            base_stmt = base_stmt.where(SKU.company_id == company_id)

        base_stmt = ListQueryHelper.apply_specs(
            base_stmt,
            [
                InOrNullSpec(Brand.id, filters.brand_ids),
                InOrNullSpec(ProductGroup.id, filters.product_group_ids),
                InOrNullSpec(PromotionType.id, filters.promotion_type_ids),
                InOrNullSpec(Distributor.id, filters.distributor_ids),
                InOrNullSpec(SKU.id, filters.sku_ids),
                SearchSpec(
                    filters.search if filters.group_by_dimensions else None, search_cols
                ),
            ],
        )

        base_stmt = ListQueryHelper.apply_period_values(
            base_stmt,
            period_values,
            year_col=PrimarySalesAndStock.year,
            month_col=PrimarySalesAndStock.month,
            quarter_col=PrimarySalesAndStock.quarter,
        )

        group_by_fields.append(period_key)
        period_agg = base_stmt.group_by(*group_by_fields).cte("period_agg")

        sort_map = {
            "sku": getattr(period_agg.c, "sku_name", None),
            "brand": getattr(period_agg.c, "brand_name", None),
            "promotion": getattr(period_agg.c, "promotion_type_name", None),
            "product_group": getattr(period_agg.c, "product_group_name", None),
            "distributor": getattr(period_agg.c, "distributor_name", None),
        }

        if not filters.group_by_dimensions:
            flat_stmt = select(
                period_agg.c.period,
                period_agg.c.packages,
                period_agg.c.amount,
            ).select_from(period_agg)
            flat_stmt = ListQueryHelper.apply_sorting_with_default(
                flat_stmt,
                getattr(filters, "sort_by", None),
                getattr(filters, "sort_order", None),
                sort_map,
            )
            flat_stmt = ListQueryHelper.apply_pagination(
                flat_stmt, filters.limit, filters.offset
            )
            return (await session.execute(flat_stmt)).mappings().all()

        # SQL pivot: GROUP BY только по ID, имена через MIN()
        pivot_select: list = []
        pivot_group_by: list = []
        pivot_sort_map: dict = {}
        for dim in filters.group_by_dimensions:
            id_col = getattr(period_agg.c, f"{dim}_id")
            name_min = func.min(getattr(period_agg.c, f"{dim}_name")).label(
                f"{dim}_name"
            )
            pivot_select.extend([id_col, name_min])
            pivot_group_by.append(id_col)
            pivot_sort_map[dim] = name_min

        pivot_stmt = (
            select(
                *pivot_select,
                func.json_object_agg(
                    period_agg.c.period,
                    func.json_build_object(
                        "packages",
                        func.cast(period_agg.c.packages, Float),
                        "amount",
                        func.cast(period_agg.c.amount, Float),
                    ),
                ).label("periods_data"),
            )
            .select_from(period_agg)
            .group_by(*pivot_group_by)
        )

        pivot_sort_map_full = {
            "sku": pivot_sort_map.get("sku"),
            "brand": pivot_sort_map.get("brand"),
            "promotion": pivot_sort_map.get("promotion_type"),
            "product_group": pivot_sort_map.get("product_group"),
            "distributor": pivot_sort_map.get("distributor"),
        }

        pivot_stmt = ListQueryHelper.apply_sorting_with_default(
            pivot_stmt,
            getattr(filters, "sort_by", None),
            getattr(filters, "sort_order", None),
            pivot_sort_map_full,
        )
        pivot_stmt = ListQueryHelper.apply_pagination(
            pivot_stmt, filters.limit, filters.offset
        )

        rows = (await session.execute(pivot_stmt)).mappings().all()
        return list(rows)

    @staticmethod
    async def get_period_totals(
        session: "AsyncSession",
        filters: sale_schema.PeriodFilter,
        company_id: int | None,
    ):
        period_key = build_period_key(filters.group_by_period, PrimarySalesAndStock)
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )

        if filters.group_by_period == "quarter":
            divisor_factor = 3.0
        elif filters.group_by_period == "year":
            divisor_factor = 12.0
        else:
            divisor_factor = 1.0

        # Pre-classify indicator type once per row to avoid repeating ilike 8+ times
        inner = (
            select(
                period_key.label("period"),
                case(
                    (PrimarySalesAndStock.indicator.in_(PRIMARY_SALES_VALUES), "sales"),
                    else_="stock",
                ).label("ind"),
                PrimarySalesAndStock.amount,
                PrimarySalesAndStock.packages,
            )
            .select_from(PrimarySalesAndStock)
            .join(SKU, PrimarySalesAndStock.sku_id == SKU.id)
            .where(
                PrimarySalesAndStock.indicator.in_(
                    PRIMARY_SALES_VALUES + PRIMARY_STOCK_VALUES
                )
            )
        )

        if company_id is not None:
            inner = inner.where(SKU.company_id == company_id)

        inner = ListQueryHelper.apply_specs(
            inner,
            [
                InOrNullSpec(SKU.brand_id, filters.brand_ids),
                InOrNullSpec(SKU.product_group_id, filters.product_group_ids),
                InOrNullSpec(
                    PrimarySalesAndStock.distributor_id, filters.distributor_ids
                ),
                InOrNullSpec(SKU.id, filters.sku_ids),
            ],
        )

        inner = ListQueryHelper.apply_period_values(
            inner,
            period_values,
            year_col=PrimarySalesAndStock.year,
            month_col=PrimarySalesAndStock.month,
            quarter_col=PrimarySalesAndStock.quarter,
        )

        b = inner.cte("base")
        is_sales = b.c.ind == "sales"
        is_stock = b.c.ind == "stock"

        sales_divisor_amount = func.nullif(
            func.sum(case((is_sales, b.c.amount), else_=0)) / divisor_factor,
            0,
        )
        sales_divisor_packages = func.nullif(
            func.sum(case((is_sales, b.c.packages), else_=0)) / divisor_factor,
            0,
        )

        select_cols = [
            b.c.period.label("period"),
            func.cast(
                case(
                    (
                        func.sum(case((is_sales, b.c.amount), else_=0)) > 0,
                        func.sum(case((is_stock, b.c.amount), else_=0))
                        / sales_divisor_amount,
                    ),
                    else_=None,
                ),
                Numeric(10, 2),
            ).label("coverage_months_amount"),
            func.cast(
                case(
                    (
                        func.sum(case((is_sales, b.c.packages), else_=0)) > 0,
                        func.sum(case((is_stock, b.c.packages), else_=0))
                        / sales_divisor_packages,
                    ),
                    else_=None,
                ),
                Numeric(10, 2),
            ).label("coverage_months_packages"),
        ]

        if filters.group_by_period not in ("quarter", "year"):
            select_cols.extend(
                [
                    func.sum(case((is_stock, b.c.packages), else_=0)).label(
                        "stock_packages"
                    ),
                    func.round(func.sum(case((is_stock, b.c.amount), else_=0))).label(
                        "stock_amount"
                    ),
                ]
            )

        select_cols.extend(
            [
                func.sum(case((is_sales, b.c.packages), else_=0)).label(
                    "sales_packages"
                ),
                func.round(func.sum(case((is_sales, b.c.amount), else_=0))).label(
                    "sales_amount"
                ),
            ]
        )

        stmt = select(*select_cols).group_by(b.c.period).order_by(b.c.period.desc())

        if filters.group_by_period not in ("year", "quarter"):
            stmt = stmt.having(
                or_(
                    func.sum(case((is_stock, b.c.packages), else_=0)) > 0,
                    func.sum(case((is_sales, b.c.packages), else_=0)) > 0,
                )
            )
        else:
            stmt = stmt.having(func.sum(case((is_sales, b.c.packages), else_=0)) > 0)

        result = await session.execute(stmt)
        return result.mappings().all()

    @staticmethod
    async def get_stock_coverage(
        session: "AsyncSession",
        filters: sale_schema.StockCoverageFilter | None = None,
        company_id: int | None = None,
    ):
        period_key = build_period_key(filters.group_by_period, PrimarySalesAndStock)
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )

        select_fields, group_by_fields, search_cols = build_dimensions(
            BASE_SALE_DIMENSTION_MAPPING, filters.group_by_dimensions
        )

        if filters.group_by_period == "quarter":
            divisor_factor = 3.0
        elif filters.group_by_period == "year":
            divisor_factor = 12.0
        else:
            divisor_factor = 1.0

        def make_coverage(stock_col, sales_col):
            return func.cast(
                case(
                    (
                        func.sum(
                            case(
                                (
                                    PrimarySalesAndStock.indicator.in_(
                                        PRIMARY_SALES_VALUES
                                    ),
                                    sales_col,
                                ),
                                else_=0,
                            )
                        )
                        > 0,
                        func.sum(
                            case(
                                (
                                    PrimarySalesAndStock.indicator.in_(
                                        PRIMARY_STOCK_VALUES
                                    ),
                                    stock_col,
                                ),
                                else_=0,
                            )
                        )
                        / func.nullif(
                            func.sum(
                                case(
                                    (
                                        PrimarySalesAndStock.indicator.in_(
                                            PRIMARY_SALES_VALUES
                                        ),
                                        sales_col,
                                    ),
                                    else_=0,
                                )
                            )
                            / divisor_factor,
                            0,
                        ),
                    ),
                    else_=0,
                ),
                Numeric(10, 2),
            )

        base_stmt = (
            select(
                *select_fields,
                period_key.label("period"),
                make_coverage(
                    PrimarySalesAndStock.amount,
                    PrimarySalesAndStock.amount,
                ).label("coverage_months_amount"),
                make_coverage(
                    PrimarySalesAndStock.packages,
                    PrimarySalesAndStock.packages,
                ).label("coverage_months_packages"),
            )
            .select_from(PrimarySalesAndStock)
            .join(SKU, PrimarySalesAndStock.sku_id == SKU.id)
            .join(Brand, SKU.brand_id == Brand.id)
            .join(PromotionType, SKU.promotion_type_id == PromotionType.id)
            .join(ProductGroup, SKU.product_group_id == ProductGroup.id)
            .join(Distributor, PrimarySalesAndStock.distributor_id == Distributor.id)
            .where(
                PrimarySalesAndStock.indicator.in_(
                    PRIMARY_SALES_VALUES + PRIMARY_STOCK_VALUES
                ),
            )
        )

        if company_id is not None:
            base_stmt = base_stmt.where(SKU.company_id == company_id)

        base_stmt = ListQueryHelper.apply_specs(
            base_stmt,
            [
                InOrNullSpec(Brand.id, filters.brand_ids),
                InOrNullSpec(ProductGroup.id, filters.product_group_ids),
                InOrNullSpec(PromotionType.id, filters.promotion_type_ids),
                InOrNullSpec(Distributor.id, filters.distributor_ids),
                InOrNullSpec(SKU.id, filters.sku_ids),
                SearchSpec(
                    filters.search if filters.group_by_dimensions else None, search_cols
                ),
            ],
        )

        base_stmt = ListQueryHelper.apply_period_values(
            base_stmt,
            period_values,
            year_col=PrimarySalesAndStock.year,
            month_col=PrimarySalesAndStock.month,
            quarter_col=PrimarySalesAndStock.quarter,
        )

        group_by_fields.append(period_key)
        period_agg = base_stmt.group_by(*group_by_fields).cte("period_agg")

        sort_map = {
            "sku": getattr(period_agg.c, "sku_name", None),
            "brand": getattr(period_agg.c, "brand_name", None),
            "promotion": getattr(period_agg.c, "promotion_type_name", None),
            "product_group": getattr(period_agg.c, "product_group_name", None),
            "distributor": getattr(period_agg.c, "distributor_name", None),
        }

        if not filters.group_by_dimensions:
            flat_stmt = select(
                period_agg.c.period,
                period_agg.c.coverage_months_amount,
                period_agg.c.coverage_months_packages,
            ).select_from(period_agg)
            flat_stmt = ListQueryHelper.apply_sorting_with_default(
                flat_stmt,
                getattr(filters, "sort_by", None),
                getattr(filters, "sort_order", None),
                sort_map,
            )
            flat_stmt = ListQueryHelper.apply_pagination(
                flat_stmt, filters.limit, filters.offset
            )
            return (await session.execute(flat_stmt)).mappings().all()

        # SQL pivot: GROUP BY только по ID, имена через MIN()
        pivot_select: list = []
        pivot_group_by: list = []
        pivot_sort_map: dict = {}
        for dim in filters.group_by_dimensions:
            id_col = getattr(period_agg.c, f"{dim}_id")
            name_min = func.min(getattr(period_agg.c, f"{dim}_name")).label(
                f"{dim}_name"
            )
            pivot_select.extend([id_col, name_min])
            pivot_group_by.append(id_col)
            pivot_sort_map[dim] = name_min

        pivot_stmt = (
            select(
                *pivot_select,
                func.json_object_agg(
                    period_agg.c.period,
                    func.json_build_object(
                        "coverage_months_amount",
                        func.cast(period_agg.c.coverage_months_amount, Float),
                        "coverage_months_packages",
                        func.cast(period_agg.c.coverage_months_packages, Float),
                    ),
                ).label("periods_data"),
            )
            .select_from(period_agg)
            .group_by(*pivot_group_by)
        )

        pivot_sort_map_full = {
            "sku": pivot_sort_map.get("sku"),
            "brand": pivot_sort_map.get("brand"),
            "promotion": pivot_sort_map.get("promotion_type"),
            "product_group": pivot_sort_map.get("product_group"),
            "distributor": pivot_sort_map.get("distributor"),
        }

        pivot_stmt = ListQueryHelper.apply_sorting_with_default(
            pivot_stmt,
            getattr(filters, "sort_by", None),
            getattr(filters, "sort_order", None),
            pivot_sort_map_full,
        )
        pivot_stmt = ListQueryHelper.apply_pagination(
            pivot_stmt, filters.limit, filters.offset
        )

        rows = (await session.execute(pivot_stmt)).mappings().all()
        return list(rows)

    @staticmethod
    async def get_distributor_share_report(
        session: "AsyncSession",
        filters: "sale_schema.DistributorShareFilter",
        company_id: int | None,
    ):
        period_key = build_period_key(filters.group_by_period, PrimarySalesAndStock)
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )

        select_fields, group_by_fields, search_cols = build_dimensions(
            BASE_SALE_DIMENSTION_MAPPING, filters.group_by_dimensions
        )

        base_stmt = (
            select(
                *select_fields,
                period_key.label("period"),
                func.round(func.sum(PrimarySalesAndStock.amount)).label("amount"),
            )
            .select_from(PrimarySalesAndStock)
            .join(SKU, PrimarySalesAndStock.sku_id == SKU.id)
            .join(Brand, SKU.brand_id == Brand.id)
            .join(PromotionType, SKU.promotion_type_id == PromotionType.id)
            .join(ProductGroup, SKU.product_group_id == ProductGroup.id)
            .join(Distributor, PrimarySalesAndStock.distributor_id == Distributor.id)
            .where(
                PrimarySalesAndStock.indicator.in_(PRIMARY_SALES_VALUES),
            )
        )

        if company_id is not None:
            base_stmt = base_stmt.where(SKU.company_id == company_id)

        base_stmt = ListQueryHelper.apply_specs(
            base_stmt,
            [
                InOrNullSpec(Brand.id, filters.brand_ids),
                InOrNullSpec(ProductGroup.id, filters.product_group_ids),
                InOrNullSpec(PromotionType.id, filters.promotion_type_ids),
                InOrNullSpec(Distributor.id, filters.distributor_ids),
                InOrNullSpec(SKU.id, filters.sku_ids),
                SearchSpec(
                    filters.search if filters.group_by_dimensions else None, search_cols
                ),
            ],
        )

        base_stmt = ListQueryHelper.apply_period_values(
            base_stmt,
            period_values,
            year_col=PrimarySalesAndStock.year,
            month_col=PrimarySalesAndStock.month,
            quarter_col=PrimarySalesAndStock.quarter,
        )

        group_by_fields.append(period_key)
        period_agg = base_stmt.group_by(*group_by_fields).cte("period_agg")

        period_totals = (
            select(
                period_agg.c.period,
                cast(func.sum(period_agg.c.amount), Numeric(18, 2)).label(
                    "total_amount"
                ),
            ).group_by(period_agg.c.period)
        ).cte("period_totals")

        percentage_select_fields = []
        if filters.group_by_dimensions:
            for dim in filters.group_by_dimensions:
                percentage_select_fields.extend(
                    [
                        getattr(period_agg.c, f"{dim}_id"),
                        getattr(period_agg.c, f"{dim}_name"),
                    ]
                )

        share_value = cast(
            case(
                (
                    period_totals.c.total_amount > 0,
                    (cast(period_agg.c.amount, Numeric) * 100)
                    / func.nullif(cast(period_totals.c.total_amount, Numeric), 0),
                ),
                else_=None,
            ),
            Numeric(12, 4),
        )

        share_expr = func.round(share_value, 2)

        with_percentages = (
            select(
                *percentage_select_fields,
                period_agg.c.period,
                period_agg.c.amount,
                share_expr.label("share_percent"),
            )
            .select_from(period_agg)
            .join(period_totals, period_agg.c.period == period_totals.c.period)
            .where(share_expr != 0)
        ).cte("with_percentages")

        sort_map = {
            "sku": getattr(with_percentages.c, "sku_name", None),
            "brand": getattr(with_percentages.c, "brand_name", None),
            "promotion": getattr(with_percentages.c, "promotion_type_name", None),
            "product_group": getattr(with_percentages.c, "product_group_name", None),
            "distributor": getattr(with_percentages.c, "distributor_name", None),
        }

        if not filters.group_by_dimensions:
            flat_stmt = select(
                with_percentages.c.period,
                func.cast(with_percentages.c.amount, Float).label("amount"),
                func.cast(with_percentages.c.share_percent, Float).label(
                    "share_percent"
                ),
            ).select_from(with_percentages)
            flat_stmt = ListQueryHelper.apply_sorting_with_default(
                flat_stmt,
                getattr(filters, "sort_by", None),
                getattr(filters, "sort_order", None),
                sort_map,
            )
            flat_stmt = ListQueryHelper.apply_pagination(
                flat_stmt, filters.limit, filters.offset
            )
            return (await session.execute(flat_stmt)).mappings().all()

        # SQL pivot: GROUP BY только по ID, имена через MIN()
        pivot_select: list = []
        pivot_group_by: list = []
        pivot_sort_map: dict = {}
        for dim in filters.group_by_dimensions:
            id_col = getattr(with_percentages.c, f"{dim}_id")
            name_min = func.min(getattr(with_percentages.c, f"{dim}_name")).label(
                f"{dim}_name"
            )
            pivot_select.extend([id_col, name_min])
            pivot_group_by.append(id_col)
            pivot_sort_map[dim] = name_min

        pivot_stmt = (
            select(
                *pivot_select,
                func.json_object_agg(
                    with_percentages.c.period,
                    func.json_build_object(
                        "amount",
                        func.cast(with_percentages.c.amount, Float),
                        "share_percent",
                        func.cast(with_percentages.c.share_percent, Float),
                    ),
                ).label("periods_data"),
            )
            .select_from(with_percentages)
            .group_by(*pivot_group_by)
        )

        pivot_sort_map_full = {
            "sku": pivot_sort_map.get("sku"),
            "brand": pivot_sort_map.get("brand"),
            "promotion": pivot_sort_map.get("promotion_type"),
            "product_group": pivot_sort_map.get("product_group"),
            "distributor": pivot_sort_map.get("distributor"),
        }

        pivot_stmt = ListQueryHelper.apply_sorting_with_default(
            pivot_stmt,
            getattr(filters, "sort_by", None),
            getattr(filters, "sort_order", None),
            pivot_sort_map_full,
        )
        pivot_stmt = ListQueryHelper.apply_pagination(
            pivot_stmt, filters.limit, filters.offset
        )

        rows = (await session.execute(pivot_stmt)).mappings().all()
        return list(rows)

    @staticmethod
    async def get_distributor_share_chart(
        session: "AsyncSession",
        filters: sale_schema.SalesReportFilter,
        company_id: int | None,
    ):
        period_key = build_period_key(filters.group_by_period, PrimarySalesAndStock)
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )

        period_totals = (
            select(
                period_key.label("period"),
                func.round(func.sum(PrimarySalesAndStock.amount)).label("total_amount"),
            )
            .select_from(PrimarySalesAndStock)
            .join(SKU, PrimarySalesAndStock.sku_id == SKU.id)
            .where(PrimarySalesAndStock.indicator.in_(PRIMARY_SALES_VALUES))
        )

        if company_id is not None:
            period_totals = period_totals.where(SKU.company_id == company_id)

        if filters.promotion_type_ids:
            period_totals = period_totals.join(
                PromotionType, SKU.promotion_type_id == PromotionType.id
            )

        period_totals = ListQueryHelper.apply_specs(
            period_totals,
            [
                InOrNullSpec(SKU.brand_id, filters.brand_ids),
                InOrNullSpec(SKU.product_group_id, filters.product_group_ids),
                InOrNullSpec(PromotionType.id, filters.promotion_type_ids),
            ],
        )

        period_totals = ListQueryHelper.apply_period_values(
            period_totals,
            period_values,
            year_col=PrimarySalesAndStock.year,
            month_col=PrimarySalesAndStock.month,
            quarter_col=PrimarySalesAndStock.quarter,
        )

        period_totals = period_totals.group_by(period_key).cte("period_totals")

        base_stmt = (
            select(
                Distributor.id.label("distributor_id"),
                Distributor.name.label("distributor_name"),
                period_key.label("period"),
                func.round(func.sum(PrimarySalesAndStock.amount)).label("amount"),
            )
            .select_from(PrimarySalesAndStock)
            .join(Distributor, PrimarySalesAndStock.distributor_id == Distributor.id)
            .join(SKU, PrimarySalesAndStock.sku_id == SKU.id)
            .where(PrimarySalesAndStock.indicator.in_(PRIMARY_SALES_VALUES))
        )

        if company_id is not None:
            base_stmt = base_stmt.where(SKU.company_id == company_id)

        base_stmt = ListQueryHelper.apply_specs(
            base_stmt,
            [
                InOrNullSpec(SKU.brand_id, filters.brand_ids),
                InOrNullSpec(SKU.product_group_id, filters.product_group_ids),
                InOrNullSpec(PromotionType.id, filters.promotion_type_ids),
            ],
        )

        base_stmt = ListQueryHelper.apply_period_values(
            base_stmt,
            period_values,
            year_col=PrimarySalesAndStock.year,
            month_col=PrimarySalesAndStock.month,
            quarter_col=PrimarySalesAndStock.quarter,
        )

        base_stmt = base_stmt.group_by(
            Distributor.id, Distributor.name, period_key
        ).cte("period_agg")

        share_chart_expr = func.round(
            case(
                (
                    period_totals.c.total_amount > 0,
                    (base_stmt.c.amount * 100.0)
                    / func.nullif(period_totals.c.total_amount, 0),
                ),
                else_=0,
            )
        )

        with_percentages = (
            select(
                base_stmt.c.distributor_id,
                base_stmt.c.distributor_name,
                base_stmt.c.period,
                base_stmt.c.amount,
                share_chart_expr.label("share_percent"),
            )
            .select_from(base_stmt)
            .join(period_totals, base_stmt.c.period == period_totals.c.period)
            .where(share_chart_expr != 0)
        ).cte("with_percentages")

        final_stmt = select(
            with_percentages.c.distributor_id,
            with_percentages.c.distributor_name,
            func.json_object_agg(
                with_percentages.c.period,
                func.json_build_object(
                    "amount",
                    func.cast(with_percentages.c.amount, Float),
                    "share_percent",
                    func.cast(with_percentages.c.share_percent, Float),
                ),
            ).label("periods_data"),
        ).group_by(
            with_percentages.c.distributor_id, with_percentages.c.distributor_name
        )

        final_stmt = ListQueryHelper.apply_pagination(
            final_stmt, filters.limit, filters.offset
        )

        result = await session.execute(final_stmt)
        return result.mappings().all()
