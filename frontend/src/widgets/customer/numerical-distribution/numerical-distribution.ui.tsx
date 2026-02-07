import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';

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
import { commonColumns, monthsPreset } from '#/shared/constants/common-columns';
import { COMMON_COLUMNS_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

export const NumericalDistribution: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
    'products/skus',
    'products/segments',
    'products/promotion-types',
    'clients/distributors',
    'clients/geo-indicators',
  ]);

  const dbFilters = useDbFilters({
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    geoIndicatorsOptions: filterOptions.options.clients_geo_indicators,
    config: {
      indicator: { enabled: false },
      rowsCount: { enabled: true },
      geoIndicators: { enabled: true },
      groupBy: {
        defaultValue: 'brand,segment,product_group,geo_indicator'.split(','),
      },
    },
  });

  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/tertiary/reports/numeric-distribution'],
      {
        ...transformColumnFiltersToPayload(
          filters,
          COMMON_COLUMNS_FILTER_KEY_MAP,
          {
            brand_ids: dbFilters.brands,
            product_group_ids: dbFilters.groups,
            geo_indicator_ids: dbFilters.geoIndicators,
          }
        ),
        ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

        limit: dbFilters.rowsCount === 'all' ? undefined : dbFilters.rowsCount,
        search: dbFilters.search,

        group_by_dimensions: ['distributor', 'sku', ...dbFilters.groupBy],
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
      commonColumns.segment(),
      commonColumns.group(),
      commonColumns.distributor(),
      commonColumns.geo_indicator(),
    ],
    months: monthsPreset('nd_percent', sales, {
      asPercent: true,
      noFraction: true,
    }),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility<TDbItem>({
      allColumns,
      setGroupBy: dbFilters.setGroupBy,
      ignore: ['sku_name', 'distributor_name'],
    });

  return (
    <PageSection
      title="Показатель нумерической дистрибьюции по аптекам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...dbFilters} />

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
              segment_name: columnHeaderNames.segment,
              product_group_name: columnHeaderNames.productGroup,
              geo_indicator_name: columnHeaderNames.geoIndicator,
              distributor_name: columnHeaderNames.distributor,
            }}
            selectKeys={['sku_name', ...visibleColumns, 'distributor_name']}
            periodAsPercent
            periodKey={'nd_percent'}
            data={sales}
            fileName="Нумерическая дистрибьюция по аптекам"
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
            data={sales}
            maxHeight={560}
            rounded="none"
          />
        </FiltersContext.Provider>
      </AsyncBoundary>
    </PageSection>
  );
});
NumericalDistribution.displayName = '_NumericalDistribution_';
