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
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';

export const NumericalDistribution: React.FC = React.memo(() => {
  const filterOptions = useFilterOptions({
    geoIndicators: true,
  });

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
    geoIndicatorsOptions: filterOptions.geoIndicators,
    config: {
      indicator: { enabled: false },
      rowsCount: { enabled: true },
      geoIndicators: { enabled: true },
    },
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/tertiary/reports/numeric-distribution'],
      {
        brand_ids: filters.brands,
        product_group_ids: filters.groups,
        limit: filters.rowsCount === 'all' ? undefined : filters.rowsCount,
        geo_indicators_ids: filters.geoIndicators,
        search: filters.search,
        group_by_dimensions: filters.groupBy.filter(
          v => !['geo_indicator'].includes(v)
        ),
        enabled: !filterOptions.isLoading,
      }
    )
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
      commonColumns.segment(),
      commonColumns.group(),
      commonColumns.geo_indicator(),
    ],
    months: monthsPreset('nd_percent', sales, { asPercent: true }),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['total'],
      setGroupBy: filters.setGroupBy,
    });

  return (
    <PageSection
      title="Показатель нумерической дистрибьюции по аптекам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...filters} />

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
            }}
            selectKeys={[
              'sku_name',
              'brand_name',
              'segment_name',
              'product_group_name',
            ]}
            periodAsPercent
            periodKey={'nd_percent'}
            data={sales}
            fileName="numerical-distribution.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
        isEmpty={sales.length === 0}
      >
        <Table
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={sales}
          maxHeight={560}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});
NumericalDistribution.displayName = '_NumericalDistribution_';
