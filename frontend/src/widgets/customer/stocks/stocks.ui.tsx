import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useDbFiltersState,
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

export const Stocks: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const lastYear = useSession(s => s.lastYear);

  const filtersState = useDbFiltersState({
    groupBy: {
      defaultValue: 'sku,brand,promotion_type,product_group,distributor'.split(
        ','
      ),
    },
  });

  const filterOptions = useFilterOptions(
    [
      'products/brands',
      'products/product-groups',
      'products/skus',
      'products/promotion-types',
      'clients/distributors',
    ],
    undefined,
    transformColumnFiltersToPayload(filters, COMMON_COLUMNS_FILTER_KEY_MAP, {
      brand_ids: filtersState.brands,
      product_group_ids: filtersState.groups,
    })
  );

  const databaseFilters = useDbFilters({
    state: filtersState,
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
  });

  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.primary,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/primary/reports/stock-levels'],
      {
        ...transformColumnFiltersToPayload(
          filters,
          COMMON_COLUMNS_FILTER_KEY_MAP,
          {
            brand_ids: filtersState.brands,
            product_group_ids: filtersState.groups,
          }
        ),
        ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

        limit:
          filtersState.rowsCount === 'all' ? undefined : filtersState.rowsCount,
        search: filtersState.search,

        group_by_dimensions: filtersState.groupBy,
        period_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,

        enabled: !filterOptions.isLoading,
        method: 'POST',
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
    months: monthsPreset(filtersState.indicator, sales),
    total: totalPreset(filtersState.indicator),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: filtersState.setGroupBy,
    });

  const { monthTotals, grandTotal } = useMemo(() => {
    return calcPeriodTotals(sales, filtersState.indicator);
  }, [sales, filtersState.indicator]);

  return (
    <PageSection
      title="Остатки"
      headerEnd={
        <div className="relative z-100 flex items-center gap-4">
          <DbFilters {...databaseFilters} {...filtersState} />
          <PeriodFilters {...periodFilter} />

          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            isMultiple
            showToggleAll
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
            periodKey={filtersState.indicator}
            data={sales}
            fileName="Остатки"
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
            key={filtersState.indicator}
            filters={{
              usedFilterItems: databaseFilters.usedFilterItems,
              resetFilters: filtersState.resetFilters,
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

Stocks.displayName = '_Stocks_';
