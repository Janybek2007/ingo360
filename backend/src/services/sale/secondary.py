import os
from collections.abc import AsyncIterator
from pathlib import Path
from typing import TYPE_CHECKING, Any
from uuid import uuid4

from sqlalchemy import Float, and_, case, func, select, text

from src.db.models import (
    SKU,
    Brand,
    Company,
    Distributor,
    GeoIndicator,
    ImportLogs,
    Pharmacy,
    ProductGroup,
    PromotionType,
    SecondarySales,
)
from src.import_fields import sale
from src.mapping.dimension_mapping.sale import (
    BASE_SALE_DIMENSTION_MAPPING_WITH_GEO_INDICATOR,
)
from src.mapping.sales import secondary_sales_mapping
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
    SECONDARY_SALES_VALUES,
    normalize_secondary_indicator,
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


class SecondarySalesService(
    BaseService[
        SecondarySales,
        sale_schema.SecondarySalesCreate,
        sale_schema.SecondarySalesUpdate,
    ]
):
    _invalidate_last_year = True

    async def create(
        self,
        session: "AsyncSession",
        obj_in: sale_schema.SecondarySalesCreate,
        load_options: list[Any] | None = None,
    ):
        return await create_or_update_sale(
            session=session,
            model=self.model,
            data=obj_in.model_dump(),
            sale_type="secondary",
            key_fields=("pharmacy_id", "sku_id", "month", "year", "indicator"),
            constraint_name="uq_secondary_sales_business_key",
            load_options=load_options,
        )

    async def update(
        self,
        session: "AsyncSession",
        item_id: int,
        obj_in: sale_schema.SecondarySalesUpdate,
        load_options: list[Any] | None = None,
    ):
        db_obj = await self.get_or_404(session, item_id)
        update_data = obj_in.model_dump(exclude_unset=True)
        if "indicator" in update_data and update_data["indicator"] is not None:
            update_data["indicator"] = normalize_indicator_for_sale(
                "secondary", update_data["indicator"]
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
        batch_size: int = 10_000,
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
                service_path="src.services.sale.SecondarySalesService",
                model_path="src.db.models.SecondarySales",
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
        batch_size: int = 2000,
    ):
        try:
            return await import_sales_from_excel(
                session=session,
                file_path=file_path,
                user_id=user_id,
                batch_size=batch_size,
                model=self.model,
                import_log_model=ImportLogs,
                target_table="Вторичные продажи",
                required_fields=sale.secondary_sales_fields,
                mapping=secondary_sales_mapping,
                key_fields=(
                    "pharmacy_id",
                    "sku_id",
                    "month",
                    "year",
                    "indicator",
                ),
                constraint_name="uq_secondary_sales_business_key",
                relations=[
                    RelationSpec(
                        model=Pharmacy,
                        name_key="аптека",
                        missing_label="аптека",
                        id_field="pharmacy_id",
                    ),
                    RelationSpec(
                        model=Distributor,
                        name_key="дистрибьютор",
                        missing_label="дистрибьютор",
                        id_field="distributor_id",
                    ),
                ],
                get_id_map=self.get_id_map,
                normalize_indicator=normalize_secondary_indicator,
            )
        finally:
            pass

    async def get_multi(
        self,
        session: "AsyncSession",
        filters: sale_schema.SecondaryTertiarySalesListRequest | None = None,
        load_options: list[Any] | None = None,
    ) -> PaginatedResponse[sale_schema.SecondarySalesResponse]:
        stmt = select(self.model)

        if load_options:
            stmt = stmt.options(*load_options)

        sort_map = {
            "pharmacy": self.model.pharmacy_id,
            "distributor": self.model.distributor_id,
            "brand": SKU.brand_id,
            "sku": self.model.sku_id,
            "month": self.model.month,
            "year": self.model.year,
            "indicator": self.model.indicator,
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
                    InOrNullSpec(self.model.pharmacy_id, filters.pharmacy_ids),
                    InOrNullSpec(self.model.sku_id, filters.sku_ids),
                    InOrNullSpec(self.model.distributor_id, filters.distributor_ids),
                    InOrNullSpec(self.model.month, filters.months),
                    InOrNullSpec(self.model.quarter, filters.quarters),
                    NumberTypedSpec(self.model.year, filters.year),
                    NumberTypedSpec(self.model.packages, filters.packages),
                    NumberTypedSpec(self.model.amount, filters.amount),
                ],
            )

            stmt = apply_sale_sku_company_filters(
                stmt, filters, self.model, normalize_secondary_indicator
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
    async def get_sales_report(
        session: "AsyncSession",
        company_id: int | None,
        filters: sale_schema.SecTerSalesReportFilter | None = None,
    ):
        period_key = build_period_key(filters.group_by_period, SecondarySales)
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )

        select_fields, group_by_fields, search_cols = build_dimensions(
            BASE_SALE_DIMENSTION_MAPPING_WITH_GEO_INDICATOR, filters.group_by_dimensions
        )

        base_stmt = (
            select(
                *select_fields,
                period_key.label("period"),
                func.sum(SecondarySales.packages).label("packages"),
                func.round(func.sum(SecondarySales.amount)).label("amount"),
            )
            .select_from(SecondarySales)
            .join(SKU, SecondarySales.sku_id == SKU.id)
            .join(Brand, SKU.brand_id == Brand.id)
            .join(PromotionType, SKU.promotion_type_id == PromotionType.id)
            .join(ProductGroup, SKU.product_group_id == ProductGroup.id)
            .join(Pharmacy, SecondarySales.pharmacy_id == Pharmacy.id)
            .outerjoin(Distributor, SecondarySales.distributor_id == Distributor.id)
            .outerjoin(GeoIndicator, Pharmacy.geo_indicator_id == GeoIndicator.id)
            .where(
                SecondarySales.indicator.in_(SECONDARY_SALES_VALUES),
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
                InOrNullSpec(SecondarySales.distributor_id, filters.distributor_ids),
                InOrNullSpec(SKU.id, filters.sku_ids),
                InOrNullSpec(GeoIndicator.id, filters.geo_indicator_ids),
                InOrNullSpec(SecondarySales.pharmacy_id, filters.pharmacy_ids),
                SearchSpec(
                    filters.search if filters.group_by_dimensions else None, search_cols
                ),
            ],
        )

        base_stmt = ListQueryHelper.apply_period_values(
            base_stmt,
            period_values,
            year_col=SecondarySales.year,
            month_col=SecondarySales.month,
            quarter_col=SecondarySales.quarter,
        )

        group_by_fields.append(period_key)
        period_agg = base_stmt.group_by(*group_by_fields).cte("period_agg")

        sort_map = {
            "sku": getattr(period_agg.c, "sku_name", None),
            "brand": getattr(period_agg.c, "brand_name", None),
            "promotion": getattr(period_agg.c, "promotion_type_name", None),
            "product_group": getattr(period_agg.c, "product_group_name", None),
            "distributor": getattr(period_agg.c, "distributor_name", None),
            "geo_indicator": getattr(period_agg.c, "geo_indicator_name", None),
            "pharmacy": getattr(period_agg.c, "pharmacy_name", None),
        }

        if not getattr(filters, "group_by_dimensions", None):
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
            result = (await session.execute(flat_stmt)).mappings().all()
            return [dict(row) for row in rows]

        sales_months = (period_values.months or []) if period_values else []
        sales_period_keys = [(y, m, f"{y}-{m:02d}") for y, m in sales_months]

        pivot_sort_map_full = {
            "sku": None,
            "brand": None,
            "promotion": None,
            "product_group": None,
            "distributor": None,
            "geo_indicator": None,
            "pharmacy": None,
        }

        if not sales_period_keys:
            # CTE + json_object_agg для quarter/year периодов
            pivot_select: list = []
            pivot_group_by: list = []
            for dim in getattr(filters, "group_by_dimensions", []):
                id_col = getattr(period_agg.c, f"{dim}_id")
                name_min = func.min(getattr(period_agg.c, f"{dim}_name")).label(
                    f"{dim}_name"
                )
                pivot_select.extend([id_col, name_min])
                pivot_group_by.append(id_col)
                pivot_sort_map_full[dim] = name_min

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

        # CASE-пивот для месячных периодов
        period_cols: list = []
        for y, m, _key in sales_period_keys:
            period_cond = and_(SecondarySales.year == y, SecondarySales.month == m)
            period_cols.extend(
                [
                    func.sum(
                        case(
                            (period_cond, func.cast(SecondarySales.packages, Float)),
                            else_=0.0,
                        )
                    ).label(f"pkg_{y}_{m}"),
                    func.round(
                        func.sum(
                            case(
                                (period_cond, func.cast(SecondarySales.amount, Float)),
                                else_=0.0,
                            )
                        )
                    ).label(f"amt_{y}_{m}"),
                ]
            )

        case_select: list = []
        case_group_by: list = []
        for dim in filters.group_by_dimensions:
            cfg = BASE_SALE_DIMENSTION_MAPPING_WITH_GEO_INDICATOR[dim]
            id_labeled = cfg["id"]
            name_min = func.min(cfg["name"].element).label(cfg["name"].key)
            case_select.extend([id_labeled, name_min])
            case_group_by.append(id_labeled.element)
            pivot_sort_map_full[dim] = name_min

        pivot_stmt = (
            select(*case_select, *period_cols)
            .select_from(SecondarySales)
            .join(SKU, SecondarySales.sku_id == SKU.id)
            .join(Brand, SKU.brand_id == Brand.id)
            .join(PromotionType, SKU.promotion_type_id == PromotionType.id)
            .join(ProductGroup, SKU.product_group_id == ProductGroup.id)
            .join(Pharmacy, SecondarySales.pharmacy_id == Pharmacy.id)
            .outerjoin(Distributor, SecondarySales.distributor_id == Distributor.id)
            .outerjoin(GeoIndicator, Pharmacy.geo_indicator_id == GeoIndicator.id)
            .where(SecondarySales.indicator.in_(SECONDARY_SALES_VALUES))
        )

        if company_id is not None:
            pivot_stmt = pivot_stmt.where(SKU.company_id == company_id)

        pivot_stmt = ListQueryHelper.apply_specs(
            pivot_stmt,
            [
                InOrNullSpec(Brand.id, filters.brand_ids),
                InOrNullSpec(ProductGroup.id, filters.product_group_ids),
                InOrNullSpec(PromotionType.id, filters.promotion_type_ids),
                InOrNullSpec(SecondarySales.distributor_id, filters.distributor_ids),
                InOrNullSpec(SKU.id, filters.sku_ids),
                InOrNullSpec(GeoIndicator.id, filters.geo_indicator_ids),
                InOrNullSpec(SecondarySales.pharmacy_id, filters.pharmacy_ids),
                SearchSpec(
                    filters.search if filters.group_by_dimensions else None, search_cols
                ),
            ],
        )

        pivot_stmt = ListQueryHelper.apply_period_values(
            pivot_stmt,
            period_values,
            year_col=SecondarySales.year,
            month_col=SecondarySales.month,
            quarter_col=SecondarySales.quarter,
        )

        pivot_stmt = pivot_stmt.group_by(*case_group_by)

        pivot_stmt = ListQueryHelper.apply_sorting_with_default(
            pivot_stmt,
            getattr(filters, "sort_by", None),
            getattr(filters, "sort_order", None),
            pivot_sort_map_full,
        )
        pivot_stmt = ListQueryHelper.apply_pagination(
            pivot_stmt, filters.limit, filters.offset
        )

        await session.execute(text("SET LOCAL jit = off"))

        rows = (await session.execute(pivot_stmt)).mappings().all()

        result = []
        for row in rows:
            dim_data: dict = {}
            for dim in getattr(filters, "group_by_dimensions", []):
                dim_data[f"{dim}_id"] = row[f"{dim}_id"]
                dim_data[f"{dim}_name"] = row[f"{dim}_name"]
            periods_data: dict = {}
            for y, m, key_str in sales_period_keys:
                periods_data[key_str] = {
                    "packages": float(row[f"pkg_{y}_{m}"] or 0),
                    "amount": float(row[f"amt_{y}_{m}"] or 0),
                }
            dim_data["periods_data"] = periods_data
            result.append(dim_data)

        return result

    @staticmethod
    async def get_period_totals(
        session: "AsyncSession",
        filters: sale_schema.SecTerSalesPeriodFilter,
        company_id: int | None,
    ):
        period_key, period_columns = build_period_key(
            filters.group_by_period, SecondarySales, with_group_fields=True
        )
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )
        stmt = (
            select(
                period_key.label("period"),
                func.sum(SecondarySales.packages).label("packages"),
                func.round(func.sum(SecondarySales.amount)).label("sales"),
            )
            .select_from(SecondarySales)
            .join(SKU, SecondarySales.sku_id == SKU.id)
            .join(Pharmacy, SecondarySales.pharmacy_id == Pharmacy.id)
            .where(SecondarySales.indicator.in_(SECONDARY_SALES_VALUES))
        )

        if company_id is not None:
            stmt = stmt.where(SKU.company_id == company_id)

        stmt = ListQueryHelper.apply_specs(
            stmt,
            [
                InOrNullSpec(SKU.brand_id, filters.brand_ids),
                InOrNullSpec(SKU.product_group_id, filters.product_group_ids),
                InOrNullSpec(SecondarySales.distributor_id, filters.distributor_ids),
                InOrNullSpec(SKU.id, filters.sku_ids),
                InOrNullSpec(Pharmacy.geo_indicator_id, filters.geo_indicator_ids),
            ],
        )

        stmt = ListQueryHelper.apply_period_values(
            stmt,
            period_values,
            year_col=SecondarySales.year,
            month_col=SecondarySales.month,
            quarter_col=SecondarySales.quarter,
        )

        stmt = stmt.group_by(*period_columns).order_by(period_key.desc())

        result = await session.execute(stmt)
        return result.mappings().all()

    @staticmethod
    async def get_total_sales_by_distributor(
        session: "AsyncSession",
        company_id: int | None,
        filters: sale_schema.ChartSalesByDistributorFilter | None = None,
    ):
        period_key = build_period_key(filters.group_by_period, SecondarySales)
        period_values = build_period_values(
            filters.group_by_period, filters.period_values
        )

        base_stmt = (
            select(
                Distributor.id.label("distributor_id"),
                Distributor.name.label("distributor_name"),
                period_key.label("period"),
                func.sum(SecondarySales.packages).label("total_packages"),
                func.round(func.sum(SecondarySales.amount)).label("total_amount"),
            )
            .select_from(SecondarySales)
            .outerjoin(Distributor, SecondarySales.distributor_id == Distributor.id)
            .join(SKU, SecondarySales.sku_id == SKU.id)
        )

        specs = [
            InOrNullSpec(SKU.brand_id, filters.brand_ids),
            InOrNullSpec(SKU.product_group_id, filters.product_group_ids),
            InOrNullSpec(SecondarySales.distributor_id, filters.distributor_ids),
        ]
        if getattr(filters, "geo_indicator_ids", None):
            base_stmt = base_stmt.join(
                Pharmacy, SecondarySales.pharmacy_id == Pharmacy.id
            )
            specs.append(
                InOrNullSpec(Pharmacy.geo_indicator_id, filters.geo_indicator_ids)
            )
        base_stmt = ListQueryHelper.apply_specs(base_stmt, specs)

        base_stmt = ListQueryHelper.apply_period_values(
            base_stmt,
            period_values,
            year_col=SecondarySales.year,
            month_col=SecondarySales.month,
            quarter_col=SecondarySales.quarter,
        )

        base_stmt = base_stmt.group_by(
            Distributor.id, Distributor.name, period_key
        ).cte("base_agg")

        final_stmt = select(
            base_stmt.c.distributor_id,
            base_stmt.c.distributor_name,
            func.json_object_agg(
                base_stmt.c.period,
                func.json_build_object(
                    "total_packages",
                    func.cast(base_stmt.c.total_packages, Float),
                    "total_amount",
                    func.cast(base_stmt.c.total_amount, Float),
                ),
            ).label("periods_data"),
        ).group_by(base_stmt.c.distributor_id, base_stmt.c.distributor_name)

        result = await session.execute(final_stmt)
        rows = result.mappings().all()
        return [dict(row) for row in rows]
