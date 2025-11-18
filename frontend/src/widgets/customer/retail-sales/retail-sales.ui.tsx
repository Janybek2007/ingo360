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

export const RetailSales: React.FC = React.memo(() => {
  const filterOptions = useFilterOptions({
    geoIndicators: true,
  });

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
    geoIndicatorsOptions: filterOptions.geoIndicators,
    config: {
      geoIndicators: { enabled: true },
    },
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(['sales/tertiary/reports/sales'], {
      brand_ids: filters.brands,
      product_group_ids: filters.groups,
      limit: filters.rowsCount === 'all' ? undefined : filters.rowsCount,
      geo_indicators_ids: filters.geoIndicators,
      search: filters.search,
      group_by_dimensions: filters.groupBy,
      enabled: !filterOptions.isLoading,
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
      commonColumns.geo_indicator(),
    ],
    months: monthsPreset(filters.indicator, sales),
    total: totalPreset(filters.indicator),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions', 'total'],
      setGroupBy: filters.setGroupBy,
    });

  const { monthTotals, grandTotal } = useMemo(() => {
    return calcPeriodTotals(sales, filters.indicator);
  }, [sales, filters.indicator]);

  return (
    <PageSection
      beforeHeader={
        <div className="max-w-[36.25rem]">
          <h4 className="font-semibold text-xl leading-[120%] text-black mb-2">
            Третичные продажи
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
          <ExportToExcelButton
            formatHeader={{
              sku_name: columnHeaderNames.sku,
              brand_name: columnHeaderNames.brand,
              promotion_type_name: columnHeaderNames.promotion,
              distributor_name: columnHeaderNames.distributor,
              product_group_name: columnHeaderNames.productGroup,
            }}
            selectKeys={visibleColumns}
            periodKey={filters.indicator}
            data={sales}
            fileName="retail-sales.xlsx"
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
          key={filters.indicator}
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={sales}
          maxHeight={560}
          rowTotal={{ firstColSpan: 1, monthTotals, grandTotal }}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

RetailSales.displayName = '_RetailSales_';
