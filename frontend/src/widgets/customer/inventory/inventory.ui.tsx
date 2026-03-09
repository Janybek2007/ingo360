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
import { PeriodFilters } from '#/shared/components/period-filters';
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
import { useSession } from '#/shared/session';
import { calcPeriodTotals } from '#/shared/utils/calculate';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

export const Inventory: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const lastYear = useSession(s => s.lastYear);

  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
    'products/skus',
    'products/promotion-types',
    'clients/distributors',
  ]);

  const databaseFilters = useDbFilters({
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    config: {
      indicator: { enabled: false },
      groupBy: {
        defaultValue:
          'sku,brand,promotion_type,product_group,distributor'.split(','),
      },
    },
  });

  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.primary,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/primary/reports/stock-coverages'],
      {
        ...transformColumnFiltersToPayload(
          filters,
          COMMON_COLUMNS_FILTER_KEY_MAP,
          {
            brand_ids: databaseFilters.brands,
            product_group_ids: databaseFilters.groups,
          }
        ),
        ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

        limit:
          databaseFilters.rowsCount === 'all'
            ? undefined
            : databaseFilters.rowsCount,
        search: databaseFilters.search,

        group_by_dimensions: databaseFilters.groupBy,
        period_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,

        method: 'POST',
        enabled: !filterOptions.isLoading,
      }
    )
  );

  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const allColumns = useGenerateColumns<TDbItem>({
    filterOptions: filterOptions.options,
    columns: [
      commonColumns.sku(),
      commonColumns.brand(),
      commonColumns.promotion(),
      commonColumns.group(),
      commonColumns.distributor(),
    ],
    months: monthsPreset('coverage_months', sales),
    total: totalPreset('coverage_months'),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: databaseFilters.setGroupBy,
    });

  const { monthTotals, grandTotal } = useMemo(() => {
    return calcPeriodTotals(sales, 'coverage_months');
  }, [sales]);

  return (
    <PageSection
      title="Товарный запас"
      headerEnd={
        <div className="relative z-100 flex items-center gap-4">
          <DbFilters {...databaseFilters} />
          <PeriodFilters {...periodFilter} />

          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            showToggleAll
            isMultiple
            checkbox
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />

          <ExportToExcelButton
            formatHeader={{
              sku_name: columnHeaderNames.sku,
              brand_name: columnHeaderNames.brand,
              promotion_type_name: columnHeaderNames.promotion,
              distributor_name: columnHeaderNames.distributor,
              product_group_name: columnHeaderNames.productGroup,
              total: columnHeaderNames.total,
            }}
            hasTotal
            selectKeys={visibleColumns}
            periodKey={'coverage_months'}
            data={sales}
            fileName="Товарный запас"
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
            key={databaseFilters.indicator}
            filters={{
              usedFilterItems: databaseFilters.usedFilterItems,
              resetFilters: databaseFilters.resetFilters,
            }}
            columns={columnsForTable}
            data={sales}
            maxHeight={560}
            // 5
            rowTotal={{ firstColSpan: 1, monthTotals, grandTotal }}
            rounded="none"
          />
        </FiltersContext.Provider>
      </AsyncBoundary>
    </PageSection>
  );
});

Inventory.displayName = '_Inventory_';
