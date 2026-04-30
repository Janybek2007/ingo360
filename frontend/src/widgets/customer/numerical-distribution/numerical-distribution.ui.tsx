import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import React from 'react';

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
import { commonColumns, monthsPreset } from '#/shared/constants/common-columns';
import { COMMON_COLUMNS_FILTER_KEY_MAP } from '#/shared/constants/filters-key-map';
import { FiltersContext } from '#/shared/context/filters';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSession } from '#/shared/session';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getFilterItems } from '#/shared/utils/get-used-items';
import {
  transformColumnFiltersToPayload,
  transformSortingToPayload,
} from '#/shared/utils/transform';

export const NumericalDistribution: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filtersState = useDbFiltersState({
    indicator: { enabled: false },
    rowsCount: { enabled: true },
    geoIndicators: { enabled: true },
    groupBy: {
      defaultValue: 'sku,brand,distributor'.split(','),
    },
  });

  const filterOptions = useFilterOptions(
    [
      'products/brands',
      'products/product-groups',
      'products/skus',
      'products/segments',
      'products/promotion-types',
      'clients/distributors',
      'clients/geo-indicators',
    ],
    'sales_tertiary',
    transformColumnFiltersToPayload(filters, COMMON_COLUMNS_FILTER_KEY_MAP, {
      brand_ids: filtersState.brands,
      product_group_ids: filtersState.groups,
    })
  );

  const lastYear = useSession(s => s.lastYear);

  const databaseFilters = useDbFilters({
    state: filtersState,
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    geoIndicatorsOptions: filterOptions.options.clients_geo_indicators,
  });

  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.primary,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/tertiary/reports/numeric-distribution'],
      {
        ...transformColumnFiltersToPayload(
          filters,
          COMMON_COLUMNS_FILTER_KEY_MAP,
          {
            brand_ids: filtersState.brands,
            product_group_ids: filtersState.groups,
            geo_indicator_ids: filtersState.geoIndicators,
          }
        ),
        ...transformSortingToPayload(sorting, COMMON_COLUMNS_FILTER_KEY_MAP),

        limit:
          filtersState.rowsCount === 'all' ? undefined : filtersState.rowsCount,
        search: filtersState.search,

        group_by_dimensions: ['distributor', 'sku', ...filtersState.groupBy],
        period_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,

        enabled: !filterOptions.isLoading && lastYear != undefined,
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
      commonColumns.sku(true, true),
      commonColumns.brand(true),
      commonColumns.segment(true),
      commonColumns.group('product_group_name', true),
      commonColumns.distributor(true),
      commonColumns.geo_indicator(columnHeaderNames.indicator2),
    ],
    months: monthsPreset('nd_percent', sales, {
      asPercent: true,
      noFraction: true,
    }),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility<TDbItem>({
      allColumns,
      setGroupBy: filtersState.setGroupBy,
      ignore: ['sku_name', 'distributor_name'],
    });

  return (
    <PageSection
      title="Показатель нумерической дистрибьюции по аптекам"
      headerEnd={
        <div className="relative z-100 flex items-center gap-4">
          <DbFilters {...databaseFilters} {...filtersState} />
          <PeriodFilters {...periodFilter} />

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
              usedFilterItems: databaseFilters.usedFilterItems,
              resetFilters: () => {
                filtersState.resetFilters();
                periodFilter.onReset();
              },
              isViewPeriods: periodFilter.isView,
              usedPeriodFilters: getFilterItems([
                {
                  value: periodFilter.selectedValues,
                  getLabelFromValue: getPeriodLabel,
                  onDelete: periodFilter.onDelete,
                },
              ]),
              periodCurrent: periodFilter.periodCurrent,
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
