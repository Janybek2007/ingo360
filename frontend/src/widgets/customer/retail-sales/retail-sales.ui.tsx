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
import { filterBySearch } from '#/shared/utils/search';

interface RetailSalesRow extends TDbItem {
  total_packages_per_period: number;
  total_amount_per_period: number;
  months?: (number | null)[];
}

export const RetailSales: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const filterOptions = useFilterOptions();

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<RetailSalesRow[]>(
      ['sales/tertiary/reports/sales'],
      {
        brand_ids: filters.values.brands,
        product_group_ids: filters.values.groups,
        limit:
          filters.values.rowsCount === 'all'
            ? undefined
            : filters.values.rowsCount,
        offset: 0,
        search,
      }
    )
  );

  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );
  console.log(sales);

  const allColumns = useGenerateColumns<RetailSalesRow>({
    data: sales,
    columns: [
      commonColumns.sku(),
      commonColumns.brand(),
      commonColumns.promotion(),
      commonColumns.group(),
      commonColumns.distributor(),
      commonColumns.indicator(),
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
      ignore: ['actions', 'total'],
    });

  const filteredData = useMemo(() => {
    const searched = filterBySearch(sales, search, [
      'sku_name',
      'brand_name',
      'product_group_name',
      'distributor_name',
      'promotion_type_name',
    ]);

    const grouped = createMonthsData(
      searched,
      row => `${row.sku_id}`,
      row => row[filters.indicator],
      row => ({ ...row })
    );

    return grouped;
  }, [search, sales, filters.indicator]);

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
      beforeHeader={
        <div className="max-w-[36.25rem]">
          <h4 className="font-semibold text-xl leading-[120%] text-black mb-2">
            Третичные продажи
          </h4>
          <p className="font-normal text-sm leading-[150%] text-[#727272]">
            Бренды помесячно — в упаковках и $ + динамика отгрузок брендов, SKU.
            Остатки товара на складах, товарный запас в днях
          </p>
        </div>
      }
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
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
            data={filteredData}
            fileName="retail-sales.xlsx"
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
          maxHeight={400}
          rowTotal={{ firstColSpan: 1, monthTotals, grandTotal }}
          rounded="none"
        />
      </AsyncBoundary>
    </PageSection>
  );
});

RetailSales.displayName = '_RetailSales_';
