import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

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
import { numberFilter, selectFilter } from '#/shared/utils/filter';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface StockRow {
  id: string;
  sku: string;
  brand: string;
  group: string;
  distributor: string;
  promoType: string;
  months: number[];
}

export const Stocks: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [brands, setBrands] = React.useState<string[]>(
    BRANDS.map(v => v.value)
  );
  const [groups, setGroups] = React.useState<string[]>(
    GROUPS.map(v => v.value)
  );
  const [moneyType, setMoneyType] = React.useState<'money' | 'packaging'>(
    'money'
  );

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
    (): ColumnDef<StockRow>[] => [
      {
        id: 'sku',
        accessorKey: 'sku.label',
        header: 'SKU',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        type: 'select',
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
        type: 'select',
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
        type: 'select',
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
        type: 'select',
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
        type: 'select',
        enablePinning: true,
        selectOptions: DISTRIBUTORS,
      },
      ...Array.from(
        { length: 12 },
        (_, i) =>
          ({
            accessorFn: (row: StockRow) => row.months[i],
            id: `month${i + 1}`,
            header: `2024/${i + 1}`,
            size: 140,
            enableColumnFilter: true,
            filterFn: numberFilter(),
            type: 'number',
          }) as ColumnDef<StockRow>
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
    const allData = generateMocks(rowsCount == 'all' ? 50 : rowsCount, {
      id: () => randomId('stock'),
      sku: SKUS,
      brand: BRANDS,
      group: GROUPS,
      promoType: PROMOTION_TYPES,
      distributor: DISTRIBUTORS,
      months: () => randomArray(12, 5, 20),
    });

    return allData.filter(
      row =>
        row.sku.label.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.label.toLowerCase().includes(search.toLowerCase()) ||
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
      title="Остатки"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, string>
            value={brands}
            setValue={setBrands}
            isMultiple
            showToggleAll
            checkbox
            items={BRANDS}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<true, string>
            value={groups}
            setValue={setGroups}
            isMultiple
            checkbox
            showToggleAll
            items={GROUPS}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, typeof moneyType>
            value={moneyType}
            setValue={setMoneyType}
            items={[
              { value: 'money', label: 'Деньги' },
              { value: 'packaging', label: 'Упаковка' },
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
            isMultiple
            checkbox
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton data={data} fileName="stocks.xlsx" />
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
        maxHeight={500}
        rowTotal={{ firstColSpan: 5, monthTotals, grandTotal }}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

Stocks.displayName = '_Stocks_';
