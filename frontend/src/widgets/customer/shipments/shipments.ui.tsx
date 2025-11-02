import React, { useMemo, useState } from 'react';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import {
  commonColumns,
  monthsPreset,
  totalPreset,
} from '#/shared/constants/common-columns';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { useGenerateColumns } from '#/shared/hooks/use-generate-columns';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { createMonthsData } from '#/shared/utils/create-months-data';

interface ShipmentRow extends TDbItem {
  total_packages_per_period: number;
  total_amount_per_period: number;
  months: (number | null)[];
}

export const Shipments: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const filterOptions = useFilterOptions();

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<ShipmentRow[]>(['sales/primary/reports/sales'], {
      brand_ids: filters.values.brands,
      product_group_ids: filters.values.groups,
      limit:
        filters.values.rowsCount === 'all'
          ? undefined
          : filters.values.rowsCount,
      offset: 0,
      search,
    })
  );

  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const allColumns = useGenerateColumns<ShipmentRow>({
    data: sales,
    columns: [
      commonColumns.sku(),
      commonColumns.brand(),
      commonColumns.promotion(),
      commonColumns.group(),
      commonColumns.distributor(),
    ],
    months: monthsPreset((row, i) => row.months?.[i]),
    total: totalPreset(row =>
      row.months?.reduce(
        (sum, val) => (val != null ? (sum ?? 0) + val : sum),
        0
      )
    ),
  });

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
    });

  const filteredData = useMemo(() => {
    const grouped = createMonthsData(
      sales,
      row => `${row.sku_id}`,
      row => row[filters.indicator],
      row => ({ ...row })
    );

    return grouped;
  }, [sales, filters.indicator]);

  const monthTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    filteredData.forEach(row => {
      const rowData = row;
      rowData.months?.forEach((value, index) => {
        if (value !== null && value !== undefined) {
          totals[index] += value;
        }
      });
    });
    return totals;
  }, [filteredData]);

  const grandTotal = useMemo(() => {
    return monthTotals.reduce((sum, val) => sum + val, 0);
  }, [monthTotals]);

  return (
    <PageSection
      title="Первичные продажи"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />

          <DbFilters {...filters} />

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
            data={filteredData}
            fileName="первичные_продажи.xlsx"
          />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <Table
          filters={{
            usedFilterItems: filters.usedFilterItems,
            resetFilters: filters.resetFilters,
          }}
          columns={columnsForTable}
          data={filteredData}
          maxHeight={500}
          rowTotal={{ firstColSpan: 1, monthTotals, grandTotal }}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

Shipments.displayName = '_Shipments_';
