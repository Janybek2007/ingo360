import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { DbQueries } from '#/entities/db';
import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import {
  BRANDS,
  DISTRIBUTORS,
  GROUPS,
  PROMOTION_TYPES,
  SKUS,
} from '#/shared/constants/test_constants';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import type { IndicatorType } from '#/shared/types/global';
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface RetailSalesRow {
  id: string;
  sku: string;
  brand: string;
  promoType: string;
  group: string;
  distributor: string;
  months: number[];
  total: number;
}

export const RetailSales: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [brands, setBrands] = React.useState<string[]>(
    BRANDS.map(v => v.value)
  );
  const [groups, setGroups] = React.useState<string[]>(
    GROUPS.map(v => v.value)
  );
  const [indicator, setIndicator] = React.useState<IndicatorType>('amount');

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<[]>(['sales/tertiary/reports/sales'], {
      limit: rowsCount === 'all' ? undefined : rowsCount,
      offset: 0,
    })
  );
  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );
  console.log(sales);

  const usedFilterItems = React.useMemo(() => {
    return getUsedFilterItems([
      rowsCount !== 'all' && {
        value: rowsCount,
        getLabelFromValue(value) {
          return value === 'all' ? 'Все' : 'Строки: '.concat(value.toString());
        },
        items: [],
        onDelete: () => setRowsCount('all'),
      },
    ]);
  }, [rowsCount]);

  const resetFilters = React.useCallback(() => {
    setBrands(BRANDS.map(v => v.value));
    setGroups(GROUPS.map(v => v.value));
    setRowsCount('all');
  }, []);

  const allColumns = useMemo(
    (): ColumnDef<RetailSalesRow>[] => [
      {
        id: 'sku',
        accessorKey: 'sku.label',
        header: 'SKU',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: SKUS,
      },
      {
        id: 'brand',
        accessorKey: 'brand.label',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: BRANDS,
      },
      {
        id: 'promoType',
        accessorKey: 'promoType.label',
        header: 'Тип промоции',
        enableColumnFilter: true,
        size: 250,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: PROMOTION_TYPES,
      },
      {
        id: 'group',
        accessorKey: 'group.label',
        header: 'Группа',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: GROUPS,
      },
      {
        id: 'distributor',
        accessorKey: 'distributor.label',
        header: 'Дистр',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        filterType: 'select',
        enablePinning: true,
        selectOptions: DISTRIBUTORS,
      },
      ...Array.from(
        { length: 12 },
        (_, i) =>
          ({
            accessorFn: (row: RetailSalesRow) => row.months[i],
            id: `month${i + 1}`,
            header: `2024/${i + 1}`,
            size: 140,
            enableColumnFilter: true,
            filterFn: numberFilter(),
            filterType: 'number',
          }) as ColumnDef<RetailSalesRow>
      ),
      {
        accessorKey: 'total',
        header: 'Итого',
        size: 120,
        cell: ({ row }) => row.original.months.reduce((a, b) => a + b, 0),
      },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility({
      allColumns,
      ignore: ['actions', 'total'],
    });

  const data = useMemo(() => {
    const allData = generateMocks(rowsCount === 'all' ? 50 : rowsCount, {
      id: () => randomId('shipment'),
      sku: SKUS,
      brand: BRANDS,
      promoType: PROMOTION_TYPES,
      group: GROUPS,
      distributor: DISTRIBUTORS,
      months: () => randomArray(12, 10, 500),
      total: () => 0,
    });
    return allData.filter(
      row =>
        row.sku.label.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.label.toLowerCase().includes(search.toLowerCase()) ||
        row.promoType.label.toLowerCase().includes(search.toLowerCase()) ||
        row.group.label.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rowsCount]);

  const monthTotals = useMemo(() => {
    const totals = Array(12).fill(0);
    data.forEach(row => {
      row.months.forEach((value, index) => {
        totals[index] += value;
      });
    });
    return totals;
  }, [data]);

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
          <Select<true, string>
            value={brands}
            setValue={setBrands}
            showToggleAll
            isMultiple
            checkbox
            items={BRANDS}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<true, string>
            value={groups}
            isMultiple
            checkbox
            showToggleAll
            setValue={setGroups}
            items={GROUPS}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, typeof indicator>
            value={indicator}
            setValue={setIndicator}
            items={[
              { value: 'amount', label: 'Деньги' },
              { value: 'packages', label: 'Упаковка' },
            ]}
            triggerText="Деньги/Упаковка"
          />
          <Select<false, typeof rowsCount>
            value={rowsCount}
            setValue={setRowsCount}
            items={[
              { value: 'all', label: 'Все' },
              { value: 10, label: '10' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
              { value: 200, label: '200' },
            ]}
            triggerText="Количество строк"
          />
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
          <ExportToExcelButton data={data} fileName="retail-sales.xlsx" />
        </div>
      }
    >
      <Table
        filters={{
          usedFilterItems,
          resetFilters,
          custom: [
            {
              id: 'brand',
              value: {
                colType: 'select',
                header: 'Бренд',
                selectValues: BRANDS.filter(b => brands.includes(b.value)),
              },
            },
            {
              id: 'group',
              value: {
                colType: 'select',
                header: 'Группа',
                selectValues: GROUPS.filter(g => groups.includes(g.value)),
              },
            },
          ],
        }}
        columns={columnsForTable}
        data={data}
        maxHeight={400}
        rowTotal={{ firstColSpan: 5, monthTotals, grandTotal }}
        rounded="none"
      />
    </PageSection>
  );
});

RetailSales.displayName = '_RetailSales_';
