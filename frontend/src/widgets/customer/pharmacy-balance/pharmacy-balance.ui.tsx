import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { columnHeaderNames } from '#/shared/constants/column-header-names';
import {
  commonColumns,
  monthsPreset,
  totalPreset,
} from '#/shared/constants/common-columns';
import { COMMON_COLUMNS_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import type { ExtraDbType } from '#/shared/types/db.type';
import { calcPeriodTotals } from '#/shared/utils/calculate';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

const INDICATOR_KEY = 'total_packages';

/** Нормализует ответ API: приводит periods_data к формату с total_packages, подтягивает плоские ключи периодов (YYYY-MM или month-Y-M). */
function normalizePharmacyStockRows(
  rows: TDbItem[]
): (TDbItem & { periods_data: Record<string, Record<string, number>> })[] {
  const periodKeyRegex = /^(\d{4})-(\d{2})$/;
  const monthKeyRegex = /^month-(\d{4})-(\d+)$/;

  const toYYYYMM = (key: string): string | null => {
    const mm = periodKeyRegex.exec(key);
    if (mm) return `${mm[1]}-${mm[2]}`;
    const month = monthKeyRegex.exec(key);
    if (month) {
      const m = parseInt(month[2], 10);
      return m >= 1 && m <= 12
        ? `${month[1]}-${String(m).padStart(2, '0')}`
        : null;
    }
    return null;
  };

  return rows.map(row => {
    const out = { ...row } as TDbItem & {
      periods_data: Record<string, Record<string, number>>;
    };
    out.periods_data = out.periods_data
      ? { ...out.periods_data }
      : ({} as Record<string, Record<string, number>>);

    for (const period of Object.keys(out.periods_data)) {
      const p = out.periods_data[period];
      if (
        p &&
        typeof (p as Record<string, number>).packages === 'number' &&
        (p as Record<string, number>).total_packages === undefined
      ) {
        (p as Record<string, number>)[INDICATOR_KEY] = (
          p as Record<string, number>
        ).packages;
      }
    }

    for (const key of Object.keys(row)) {
      if (key === 'periods_data') continue;
      const normalized = toYYYYMM(key);
      if (!normalized) continue;
      const val = (row as Record<string, unknown>)[key];
      if (typeof val !== 'number') continue;
      if (!out.periods_data[normalized]) out.periods_data[normalized] = {};
      out.periods_data[normalized][INDICATOR_KEY] = val;
    }

    return out;
  });
}

export const PharmacyBalance: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
    'products/skus',
    'employees/employees',
  ]);

  const dbFilters = useDbFilters({
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    config: {
      indicator: { enabled: false },
      groupBy: {
        defaultValue: 'sku,brand,responsible_employee,product_group'.split(','),
      },
    },
  });

  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/tertiary/reports/stock' as ExtraDbType],
      {
        ...transformColumnFiltersToPayload(
          filters,
          COMMON_COLUMNS_FILTER_KEY_MAP,
          { brand_ids: dbFilters.brands, product_group_ids: dbFilters.groups }
        ),
        ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

        limit: dbFilters.rowsCount === 'all' ? undefined : dbFilters.rowsCount,
        search: dbFilters.search,

        group_by_dimensions: dbFilters.groupBy.filter(dimension =>
          [
            'sku',
            'brand',
            'promotion_type',
            'product_group',
            'distributor',
            'geo_indicator',
          ].includes(dimension)
        ),
        period_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,

        enabled: !filterOptions.isLoading,
        method: 'POST',
      }
    )
  );

  const sales = useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const normalizedSales = useMemo(
    () => normalizePharmacyStockRows(sales),
    [sales]
  );

  const allColumns = useGenerateColumns<TDbItem>({
    filterOptions: filterOptions.options,
    columns: [
      commonColumns.sku(),
      commonColumns.brand(),
      commonColumns.group(),
      commonColumns.responsible_employee(),
    ],
    months: monthsPreset(INDICATOR_KEY, normalizedSales),
    total: totalPreset(INDICATOR_KEY),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: dbFilters.setGroupBy,
    });

  const { monthTotals, grandTotal } = useMemo(
    () => calcPeriodTotals(normalizedSales, INDICATOR_KEY),
    [normalizedSales]
  );

  return (
    <PageSection
      title="Остаток по аптекам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...dbFilters} />

          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            isMultiple
            checkbox
            showToggleAll
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton
            formatHeader={{
              sku_name: columnHeaderNames.sku,
              brand_name: columnHeaderNames.brand,
              distributor_name: columnHeaderNames.distributor,
              product_group_name: columnHeaderNames.productGroup,
              responsible_employee_name: columnHeaderNames.responsibleEmployee,
              total: columnHeaderNames.total,
            }}
            hasTotal
            selectKeys={visibleColumns}
            periodKey={INDICATOR_KEY}
            data={normalizedSales}
            fileName="Остаток по аптекам"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <FiltersContext.Provider
          value={{ filters, setFilters, sorting, setSorting }}
        >
          <Table
            filters={{
              usedFilterItems: dbFilters.usedFilterItems,
              resetFilters: dbFilters.resetFilters,
            }}
            columns={columnsForTable}
            data={normalizedSales}
            maxHeight={560}
            rowTotal={{ firstColSpan: 1, monthTotals, grandTotal }}
            rounded="none"
          />
        </FiltersContext.Provider>
      </AsyncBoundary>
    </PageSection>
  );
});

PharmacyBalance.displayName = '_PharmacyBalance_';
