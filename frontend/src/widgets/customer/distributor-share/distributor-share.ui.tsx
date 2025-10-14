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

interface DistributorShareRow {
  id: string;
  sku: string;
  brand: string;
  group: string;
  distributor: string;
  months: number[];
}

export const DistributorShare: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');
  const [brand, setBrand] = React.useState<string>('');
  const [group, setGroup] = React.useState<string>('');
  const [moneyType, setMoneyType] = React.useState<'money' | 'packaging'>(
    'money'
  );

  const usedFilterItems = React.useMemo(() => {
    return getUsedFilterItems([
      {
        value: brand,
        items: BRANDS,
        onDelete: () => setBrand(''),
      },
      {
        value: group,
        items: GROUPS,
        onDelete: () => setGroup(''),
      },
    ]);
  }, [brand, group]);

  const resetFilters = React.useCallback(() => {
    setBrand('');
    setGroup('');
  }, []);

  const allColumns = useMemo(
    (): ColumnDef<DistributorShareRow>[] => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        type: 'select',
        enablePinning: true,
        selectOptions: SKUS,
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        type: 'select',
        enablePinning: true,
        selectOptions: BRANDS,
      },
      {
        accessorKey: 'promoType',
        header: 'Тип промоции',
        enableColumnFilter: true,
        size: 250,
        filterFn: selectFilter(),
        type: 'select',
        enablePinning: true,
        selectOptions: PROMOTION_TYPES,
      },
      {
        accessorKey: 'group',
        header: 'Группа',
        enableColumnFilter: true,
        size: 150,
        filterFn: selectFilter(),
        type: 'select',
        enablePinning: true,
        selectOptions: GROUPS,
      },
      {
        accessorKey: 'distributor',
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
            accessorFn: (row: DistributorShareRow) => row.months[i],
            id: `month${i + 1}`,
            header: `2024/${i + 1}`,
            size: 140,
            enableColumnFilter: true,
            filterFn: numberFilter(),
            type: 'number',
          }) as ColumnDef<DistributorShareRow>
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
      sku: SKUS.map(v => v.value),
      brand: BRANDS.map(v => v.value),
      promoType: PROMOTION_TYPES.map(p => p.value),
      group: GROUPS.map(v => v.value),
      distributor: DISTRIBUTORS.map(v => v.value),
      months: () => randomArray(12, 5, 20),
    });

    return allData.filter(
      row =>
        row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.toLowerCase().includes(search.toLowerCase()) ||
        row.group.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.toLowerCase().includes(search.toLowerCase())
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
      title="Доли дистрибьюторов в деньгах/процентах"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<false, string>
            value={brand}
            setValue={setBrand}
            items={[{ value: '', label: 'Все' }, ...BRANDS]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={group}
            setValue={setGroup}
            items={[{ value: '', label: 'Все' }, ...GROUPS]}
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
            checkbox
            isMultiple
            classNames={{
              menu: 'min-w-[11.25rem] right-0',
            }}
          />
          <ExportToExcelButton data={data} fileName="distributor-share.xlsx" />
        </div>
      }
    >
      <Table
        filters={{ usedFilterItems, resetFilters }}
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

DistributorShare.displayName = '_DistributorShare_';
