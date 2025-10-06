import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { numberFilter, stringFilter } from '#/shared/utils/filter';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface NumericalDistributionRow {
  id: string;
  sku: string;
  brand: string;
  promoType: string;
  group: string;
  distributor: string;
  months: number[];
}

const SKUS = ['Товар 1', 'Товар 2', 'Товар 3'] as const;
const BRANDS = ['Бренд 1', 'Бренд 2', 'Бренд 3'] as const;
const PROMO_TYPES = ['Промо', 'Скидка', 'Акция'] as const;
const GROUPS = ['Группа 1', 'Группа 2'] as const;
const DISTRIBUTORS = ['Эрай', 'Альфа', 'Бета'] as const;

export const NumericalDistribution: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState<'all' | number>('all');

  const allColumns = useMemo(
    (): ColumnDef<NumericalDistributionRow>[] => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
      },
      {
        accessorKey: 'promoType',
        header: 'Тип промоции',
        enableColumnFilter: true,
        size: 160,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
      },
      {
        accessorKey: 'group',
        header: 'Группа',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
      },
      {
        accessorKey: 'distributor',
        header: 'Дистр',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
      },
      ...Array.from(
        { length: 12 },
        (_, i) =>
          ({
            accessorFn: (row: NumericalDistributionRow) => row.months[i],
            id: `month${i + 1}`,
            header: `2024/${i + 1}`,
            size: 140,
            enableColumnFilter: true,
            filterFn: numberFilter(),
            type: 'number',
          }) as ColumnDef<NumericalDistributionRow>
      ),
      {
        accessorKey: 'total',
        header: 'Итого',
        size: 120,
        accessorFn: (row: NumericalDistributionRow) =>
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
    const allData = generateMocks(rowsCount == 'all' ? 100 : rowsCount, {
      id: () => randomId('distribution'),
      sku: SKUS,
      brand: BRANDS,
      promoType: PROMO_TYPES,
      group: GROUPS,
      distributor: DISTRIBUTORS,
      months: () => randomArray(12, 5, 500),
    });

    return allData.filter(
      row =>
        row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.toLowerCase().includes(search.toLowerCase()) ||
        row.promoType.toLowerCase().includes(search.toLowerCase()) ||
        row.group.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rowsCount]);

  return (
    <PageSection
      title="Показатель нумерической дистрибуции по аптекам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<false, string>
            value={'brand1'}
            setValue={() => {}}
            items={[
              { value: 'brand1', label: 'Бренд 1' },
              { value: 'brand2', label: 'Бренд 2' },
              { value: 'brand3', label: 'Бренд 3' },
            ]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={'group1'}
            setValue={() => {}}
            items={[
              { value: 'group1', label: 'Группа 1' },
              { value: 'group2', label: 'Группа 2' },
              { value: 'group3', label: 'Группа 3' },
            ]}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={'money'}
            setValue={() => {}}
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
          <ExportToExcelButton
            data={data}
            fileName="numerical-distribution.xlsx"
          />
        </div>
      }
    >
      <Table
        columns={columnsForTable}
        data={data}
        isScrollbar
        maxHeight={550}
        rounded="none"
      />
    </PageSection>
  );
});
NumericalDistribution.displayName = '_NumericalDistribution_';
