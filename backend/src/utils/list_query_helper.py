from collections.abc import Iterable
from dataclasses import dataclass
from typing import Any

from sqlalchemy import Numeric, asc, desc, func, literal, or_, tuple_


@dataclass(frozen=True)
class InOrNullSpec:
    column: Any
    values: list[int | str] | None


@dataclass(frozen=True)
class NumberTypedSpec:
    column: Any
    expr: str | None


@dataclass(frozen=True)
class StringTypedSpec:
    column: Any
    expr: str | None


@dataclass(frozen=True)
class BoolListSpec:
    column: Any
    values: list[str] | None


@dataclass(frozen=True)
class EqualsSpec:
    column: Any
    value: Any


@dataclass(frozen=True)
class SearchSpec:
    term: str | None
    columns: list  # list[Any]


class ListQueryHelper:
    @staticmethod
    def apply_search(stmt, term: str | None, columns: list):
        if not term or not columns:
            return stmt
        like = f"%{term}%"
        return stmt.where(or_(*[c.ilike(like) for c in columns]))

    @staticmethod
    def apply_specs(stmt, specs: Iterable[Any]):
        """
        Применяет набор спецификаций фильтров.
        """
        for spec in specs:
            if spec is None:
                continue

            if isinstance(spec, InOrNullSpec):
                stmt = ListQueryHelper.apply_in_or_null(stmt, spec.column, spec.values)
                continue

            if isinstance(spec, NumberTypedSpec):
                stmt = ListQueryHelper.apply_number_typed_filter(
                    stmt, spec.column, spec.expr
                )
                continue

            if isinstance(spec, StringTypedSpec):
                stmt = ListQueryHelper.apply_string_typed_filter(
                    stmt, spec.column, spec.expr
                )
                continue

            if isinstance(spec, BoolListSpec):
                stmt = ListQueryHelper.apply_boolean_list_filter(
                    stmt, spec.column, spec.values
                )
                continue

            if isinstance(spec, EqualsSpec):
                if spec.value is not None:
                    stmt = stmt.where(spec.column == spec.value)
                continue

            if isinstance(spec, SearchSpec):
                stmt = ListQueryHelper.apply_search(stmt, spec.term, spec.columns)
                continue

        return stmt

    @staticmethod
    def apply_string_typed_filter(stmt, column, expr: str | None):
        """
        Поддержка:
          contains:value      -> ILIKE %value%
          startsWith:value    -> ILIKE value%
          equals:value        -> = value
          doesNotEqual:value  -> != value (и NULL тоже пропускаем как "не равно")
        """
        if not expr:
            return stmt

        parsed = parse_typed_filter(expr)
        if not parsed:
            return stmt

        op, raw = parsed
        raw = raw.strip()
        if raw == "":
            return stmt

        if op == "contains":
            return stmt.where(column.ilike(f"%{raw}%"))
        if op == "startsWith":
            return stmt.where(column.ilike(f"{raw}%"))
        if op == "equals":
            return stmt.where(column == raw)
        if op == "doesNotEqual":
            # чтобы NULL тоже считался "не равно"
            return stmt.where((column.is_(None)) | (column != raw))

        return stmt

    @staticmethod
    def _build_number_condition(column, expr: str | None):
        """Возвращает SQLAlchemy-условие для числового фильтра или None."""
        if not expr:
            return None

        parsed = parse_typed_filter(expr)
        if not parsed:
            return None

        op, raw = parsed

        def to_num(x: str):
            x = x.strip()
            if x == "":
                return None
            try:
                return int(x)
            except ValueError:
                try:
                    return float(x)
                except ValueError:
                    return None

        if op == "between":
            parts = [p.strip() for p in raw.split(",")]
            if len(parts) != 2:
                return None
            a, b = to_num(parts[0]), to_num(parts[1])
            if a is None or b is None:
                return None
            lo, hi = (a, b) if a <= b else (b, a)
            return column.between(lo, hi)

        n = to_num(raw)
        if n is None:
            return None

        if op == "=":
            return column == n
        if op == ">":
            return column > n
        if op == ">=":
            return column >= n
        if op == "<":
            return column < n
        if op == "<=":
            return column <= n

        return None

    @staticmethod
    def _build_string_condition(column, expr: str | None):
        """Возвращает SQLAlchemy-условие для строкового фильтра или None."""
        if not expr:
            return None

        parsed = parse_typed_filter(expr)
        if not parsed:
            return None

        op, raw = parsed
        raw = raw.strip()
        if raw == "":
            return None

        if op == "contains":
            return column.ilike(f"%{raw}%")
        if op == "startsWith":
            return column.ilike(f"{raw}%")
        if op == "equals":
            return column == raw
        if op == "doesNotEqual":
            return (column.is_(None)) | (column != raw)

        return None

    @staticmethod
    def apply_number_typed_filter(stmt, column, expr: str | None):
        cond = ListQueryHelper._build_number_condition(column, expr)
        return stmt.where(cond) if cond is not None else stmt

    @staticmethod
    def apply_having_specs(stmt, specs: Iterable[Any]):
        """Аналог apply_specs, но применяет условия через HAVING."""
        for spec in specs:
            if spec is None:
                continue

            if isinstance(spec, NumberTypedSpec):
                cond = ListQueryHelper._build_number_condition(spec.column, spec.expr)
                if cond is not None:
                    stmt = stmt.having(cond)
                continue

            if isinstance(spec, StringTypedSpec):
                cond = ListQueryHelper._build_string_condition(spec.column, spec.expr)
                if cond is not None:
                    stmt = stmt.having(cond)
                continue

        return stmt

    @staticmethod
    def period_json_sort_expr(periods_data_col, period_key: str, indicator: str):
        """CAST(json_extract_path_text(periods_data, period_key, indicator) AS NUMERIC) для ORDER BY / WHERE."""
        return func.cast(
            func.json_extract_path_text(
                periods_data_col, literal(period_key), literal(indicator)
            ),
            Numeric,
        )

    @staticmethod
    def build_sort_payload(sort_by: str | None, sort_order: str | None):
        if sort_by and sort_order:
            return {sort_by: sort_order}
        return None

    @staticmethod
    def apply_sorting_with_default(
        stmt,
        sort_by: str | None,
        sort_order: str | None,
        sort_map: dict[str, Any],
        default_sort=None,
    ):
        sort_payload = ListQueryHelper.build_sort_payload(sort_by, sort_order)
        return ListQueryHelper.apply_sorting(stmt, sort_payload, sort_map, default_sort)

    @staticmethod
    def apply_sorting_with_created(
        stmt,
        created_sort,
    ):
        return stmt.order_by(created_sort)

    @staticmethod
    def apply_sorting(
        stmt, sort: dict[str, str] | None, sort_map: dict[str, Any], default_sort=None
    ):
        if sort:
            for field, direction in sort.items():
                column = sort_map.get(field)
                if column is None:
                    continue
                stmt = stmt.order_by(
                    asc(column) if direction == "ASC" else desc(column)
                )

        #  default_sort как список/кортеж
        if default_sort is not None:
            if isinstance(default_sort, (list, tuple)):
                stmt = stmt.order_by(*default_sort)
            else:
                stmt = stmt.order_by(default_sort)

        return stmt

    @staticmethod
    def apply_in_or_null(stmt, column, values: list[int | str] | None):
        if not values:
            return stmt

        is_string = any(isinstance(v, str) for v in values)
        include_null = 0 in values if not is_string else any(v is None for v in values)

        if is_string:
            normalized_values = [
                v.lower() for v in values if isinstance(v, str) and v.strip() != ""
            ]

            if include_null and normalized_values:
                str_cond = (
                    func.lower(column) == normalized_values[0]
                    if len(normalized_values) == 1
                    else func.lower(column).in_(normalized_values)
                )
                return stmt.where(or_(str_cond, column.is_(None)))

            if include_null:
                return stmt.where(column.is_(None))

            if len(normalized_values) == 1:
                return stmt.where(func.lower(column) == normalized_values[0])
            return stmt.where(func.lower(column).in_(normalized_values))

        non_zero_values = [value for value in values if value != 0]

        if include_null and non_zero_values:
            num_cond = (
                column == non_zero_values[0]
                if len(non_zero_values) == 1
                else column.in_(non_zero_values)
            )
            return stmt.where(or_(num_cond, column.is_(None)))

        if include_null:
            return stmt.where(column.is_(None))

        if len(non_zero_values) == 1:
            return stmt.where(column == non_zero_values[0])
        return stmt.where(column.in_(non_zero_values))

    @staticmethod
    def apply_period_values(
        stmt,
        period_values,
        *,
        year_col,
        month_col=None,
        quarter_col=None,
    ):
        if period_values is None:
            return stmt

        group_by_period = (period_values.group_by_period or "month").strip().lower()

        if group_by_period == "year":
            if not period_values.years:
                return stmt
            years = period_values.years
            if len(years) == 1:
                return stmt.where(year_col == years[0])
            return stmt.where(year_col.in_(years))

        if group_by_period == "quarter":
            if not period_values.quarters or quarter_col is None:
                return stmt
            quarters = period_values.quarters
            if len(quarters) == 1:
                y, q = quarters[0]
                return stmt.where((year_col == y) & (quarter_col == q))
            return stmt.where(tuple_(year_col, quarter_col).in_(quarters))

        if not period_values.months or month_col is None:
            return stmt

        months = period_values.months

        # Group months by year
        months_by_year: dict[int, set[int]] = {}
        for year, month in months:
            months_by_year.setdefault(year, set()).add(month)

        # If all 12 months are selected for every year, only filter by year
        if all(len(m) == 12 for m in months_by_year.values()):
            years = list(months_by_year.keys())
            if len(years) == 1:
                return stmt.where(year_col == years[0])
            return stmt.where(year_col.in_(years))

        if len(months) == 1:
            y, m = months[0]
            return stmt.where((year_col == y) & (month_col == m))
        return stmt.where(tuple_(year_col, month_col).in_(months))

    @staticmethod
    def apply_pagination(stmt, limit: int | None, offset: int | None):
        if limit:
            stmt = stmt.limit(limit)
        if offset:
            stmt = stmt.offset(offset)
        return stmt

    @staticmethod
    def apply_boolean_list_filter(stmt, column, values: list[str] | None):
        """
        values: ['true'], ['false'], ['true','false']
        """
        if not values:
            return stmt

        bools: list[bool] = []

        for v in values:
            if isinstance(v, bool):
                bools.append(v)
            elif isinstance(v, str):
                if v.lower() == "true":
                    bools.append(True)
                elif v.lower() == "false":
                    bools.append(False)

        # если пришли оба значения - фильтр не нужен
        if len(set(bools)) == 2:
            return stmt

        if not bools:
            return stmt

        if len(bools) == 1:
            return stmt.where(column == bools[0])

        return stmt.where(or_(*(column == b for b in set(bools))))


def parse_typed_filter(expr: str) -> tuple[str, str] | None:
    """
    expr: "contains:натрий" | ">=:2024" | "between:10,20"
    returns: (op, raw)
    """
    if not expr or ":" not in expr:
        return None
    op, raw = expr.split(":", 1)
    op = (op or "").strip()
    raw = (raw or "").strip()
    if not op or raw == "":
        return None
    return op, raw
