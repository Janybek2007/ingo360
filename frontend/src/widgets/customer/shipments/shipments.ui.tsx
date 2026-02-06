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
import { FiltersContext } from '#/shared/context/filters';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { calcPeriodTotals } from '#/shared/utils/calculate';

export const Shipments: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
  ]);

  const dbFilters = useDbFilters({
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    config: {
      groupBy: {
        defaultValue:
          'sku,brand,promotion_type,product_group,distributor'.split(','),
      },
    },
  });

  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(['sales/primary/reports/sales'], {
      brand_ids: dbFilters.brands,
      product_group_ids: dbFilters.groups,
      limit: dbFilters.rowsCount === 'all' ? undefined : dbFilters.rowsCount,
      search: dbFilters.search,
      group_by_dimensions: dbFilters.groupBy,
      enabled: !filterOptions.isLoading,
      period_values: periodFilter.selectedValues,
      group_by_period: periodFilter.period,
    })
  );

  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const allColumns = useGenerateColumns<TDbItem>({
    data: sales,
    columns: [
      commonColumns.sku(),
      commonColumns.brand(),
      commonColumns.promotion(),
      commonColumns.group(),
      commonColumns.distributor(),
    ],
    months: monthsPreset(dbFilters.indicator, sales),
    total: totalPreset(dbFilters.indicator, { periods: dbFilters.periods }),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: dbFilters.setGroupBy,
      setPeriods: dbFilters.setPeriods,
    });

  const { monthTotals, grandTotal } = useMemo(() => {
    return calcPeriodTotals(sales, dbFilters.indicator);
  }, [sales, dbFilters.indicator]);

  return (
    <PageSection
      title="Первичные продажи"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...dbFilters} />

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
            periodKey={dbFilters.indicator}
            data={sales}
            fileName="Первичные продажи"
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
            key={dbFilters.indicator}
            filters={{
              usedFilterItems: dbFilters.usedFilterItems,
              resetFilters: dbFilters.resetFilters,
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

Shipments.displayName = '_Shipments_';
