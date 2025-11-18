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
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { calcPeriodTotals } from '#/shared/utils/calculate';

export const TertiaryVisits: React.FC = React.memo(() => {
  const filterOptions = useFilterOptions();

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(['sales/tertiary/reports/sales'], {
      brand_ids: filters.brands,
      product_group_ids: filters.groups,
      limit: filters.rowsCount === 'all' ? undefined : filters.rowsCount,
      search: filters.search,
      group_by_dimensions: filters.groupBy,
      enabled: !filterOptions.isLoading,
    })
  );

  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const allColumns = useGenerateColumns<TDbItem>({
    data: visits,
    columns: [
      commonColumns.sku(),
      commonColumns.brand(),
      commonColumns.promotion(),
      commonColumns.group(),
      commonColumns.distributor(),
      commonColumns.geo_indicator(),
    ],
    months: monthsPreset(filters.indicator, visits),
    total: totalPreset(filters.indicator),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['total'],
      setGroupBy: filters.setGroupBy,
    });

  const { monthTotals, grandTotal } = useMemo(() => {
    return calcPeriodTotals(visits, filters.indicator);
  }, [visits, filters.indicator]);

  return (
    <PageSection
      beforeHeader={
        <div className="max-w-[36.25rem]">
          <h4 className="font-semibold text-xl leading-[120%] text-black mb-2">
            Третичные визиты
          </h4>
        </div>
      }
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <DbFilters {...filters} />

          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            isMultiple
            showToggleAll
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton<TDbItem>
            formatHeader={{
              sku_name: columnHeaderNames.sku,
              brand_name: columnHeaderNames.brand,
              promotion_type_name: columnHeaderNames.promotion,
              distributor_name: columnHeaderNames.distributor,
              product_group_name: columnHeaderNames.productGroup,
            }}
            selectKeys={visibleColumns.filter(v => !['total'].includes(v))}
            periodKey={filters.indicator}
            data={visits}
            fileName="tertiary-visits.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <Table
          key={filters.indicator}
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={visits}
          maxHeight={400}
          rowTotal={{ firstColSpan: 1, monthTotals, grandTotal }}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

TertiaryVisits.displayName = '_TertiaryVisits_';
