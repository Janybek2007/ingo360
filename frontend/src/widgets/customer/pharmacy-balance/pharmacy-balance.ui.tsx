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
  SKUS,
} from '#/shared/constants/test_constants';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { selectFilter } from '#/shared/utils/filter';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface PharmacyBalanceRow {
  id: string;
  pharmacy: string;
  sku: string;
  brand: string;
  promoType: string;
  group: string;
  distributor: string;
  months: number[];
}

export const PharmacyBalance: React.FC = React.memo(() => {
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
    (): ColumnDef<PharmacyBalanceRow>[] => [
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
      ...Array.from({ length: 12 }, (_, i) => ({
        accessorFn: (row: PharmacyBalanceRow) => row.months[i],
        id: `month${i + 1}`,
        header: `2024/${i + 1}`,
        size: 100,
      })),
      {
        accessorKey: 'total',
        header: 'Итого',
        size: 120,
        accessorFn: (row: PharmacyBalanceRow) =>
          row.months.reduce((a, b) => a + b, 0),
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
      group: GROUPS,
      distributor: DISTRIBUTORS,
      months: () => randomArray(12, 10, 500),
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
      title="Остаток по аптекам"
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
            showToggleAll
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton data={data} fileName="white-spots.xlsx" />
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
        rowTotal={{ firstColSpan: 4, monthTotals, grandTotal }}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

PharmacyBalance.displayName = '_PharmacyBalance_';
