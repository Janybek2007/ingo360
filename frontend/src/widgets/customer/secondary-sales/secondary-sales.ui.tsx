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
import { calcPeriodTotals } from '#/shared/utils/calculate';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

export const SecondarySales: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
    'products/skus',
    'products/promotion-types',
    'clients/distributors',
    'clients/geo-indicators',
  ]);

  const databaseFilters = useDbFilters({
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    geoIndicatorsOptions: filterOptions.options.clients_geo_indicators,
    config: {
      geoIndicators: { enabled: true },
      groupBy: {
        defaultValue:
          'sku,brand,promotion_type,product_group,distributor,geo_indicator'.split(
            ','
          ),
      },
    },
  });

  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(['sales/secondary/reports/sales'], {
      ...transformColumnFiltersToPayload(
        filters,
        COMMON_COLUMNS_FILTER_KEY_MAP,
        {
          brand_ids: databaseFilters.brands,
          product_group_ids: databaseFilters.groups,
          geo_indicator_ids: databaseFilters.geoIndicators,
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

      enabled: !filterOptions.isLoading,

      method: 'POST',
    })
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
      commonColumns.geo_indicator(),
    ],
    months: monthsPreset(databaseFilters.indicator, sales),
    total: totalPreset(databaseFilters.indicator),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      setGroupBy: databaseFilters.setGroupBy,
    });

  const { monthTotals, grandTotal } = useMemo(() => {
    return calcPeriodTotals(sales, databaseFilters.indicator);
  }, [sales, databaseFilters.indicator]);

  return (
    <PageSection
      title="Вторичные продажи"
      headerEnd={
        <div className="relative z-100 flex items-center gap-4">
          <DbFilters {...databaseFilters} />
          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            showToggleAll
            isMultiple
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
              geo_indicator_name: columnHeaderNames.geoIndicator,
              total: columnHeaderNames.total,
            }}
            hasTotal
            selectKeys={visibleColumns}
            periodKey={databaseFilters.indicator}
            data={sales}
            fileName="Вторичные продажи"
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
            // 6
            rowTotal={{ firstColSpan: 1, monthTotals, grandTotal }}
            rounded="none"
          />
        </FiltersContext.Provider>
      </AsyncBoundary>
    </PageSection>
  );
});

SecondarySales.displayName = '_SecondarySales_';
