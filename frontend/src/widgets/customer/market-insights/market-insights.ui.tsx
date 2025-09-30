import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { stringFilter } from '#/shared/utils/filter';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface MarketRow {
  id: string;
  sku: string;
  brand: string;
  segment: string;
  group: string;
  distributor: string;
  YTD6M23: number;
  YTD6M24: number;
  YTD6M25: number;
}

const SKUS = [
  'Товар 1',
  'Товар 2',
  'Товар 3',
  'Товар 4',
  'Товар 5',
  'Товар 6',
  'Товар 7',
  'Товар 8',
  'Товар 9',
  'Товар 10',
  'Товар 11',
  'Товар 12',
  'Товар 13',
  'Товар 14',
  'Товар 15',
] as const;
const BRANDS = ['Бренд 1', 'Бренд 2'] as const;
const PROMO_TYPES = ['Промо', 'Акция'] as const;
const GROUPS = ['Группа 1', 'Группа 2'] as const;
const DISTRIBUTORS = ['Эрай', 'Альфа', 'Бета'] as const;

export const MarketInsights: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');
  const [rowsCount, setRowsCount] = useState(10);

  const allColumns = useMemo(
    (): ColumnDef<MarketRow>[] => [
      {
        accessorKey: 'sku',
        header: 'Компания',
        size: 134,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        size: 134,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'segment',
        header: 'Сегмент',
        size: 134,
        enableColumnFilter: true,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'group',
        header: 'Форма выписка',
        size: 144,
      },
      {
        accessorKey: 'distributor',
        header: 'Дозировка',
        size: 134,
      },
      {
        accessorKey: 'YTD6M23',
        header: 'YTD-6M-23',
        size: 134,
      },
      {
        accessorKey: 'YTD6M24',
        header: 'YTD-6M-24',
        size: 134,
      },
      {
        accessorKey: 'YTD6M25',
        header: 'YTD-6M-25',
        size: 134,
      },
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility(allColumns);

  const data = useMemo(() => {
    const allData = generateMocks(rowsCount, {
      id: () => randomId('market'),
      sku: SKUS,
      brand: BRANDS,
      segment: PROMO_TYPES,
      group: GROUPS,
      distributor: DISTRIBUTORS,
      YTD6M23: () => randomInt(0, 1000),
      YTD6M24: () => randomInt(0, 1000),
      YTD6M25: () => randomInt(0, 1000),
    });

    return allData.filter(
      row =>
        row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.toLowerCase().includes(search.toLowerCase()) ||
        row.segment.toLowerCase().includes(search.toLowerCase()) ||
        row.group.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, rowsCount]);

  return (
    <PageSection
      title="Данные по рынкам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true, string>
            value={['brand', 'group']}
            setValue={() => {}}
            checkbox
            items={[
              { value: 'brand', label: 'Бренд' },
              { value: 'group', label: 'Группа' },
            ]}
            triggerText="Бренд/Группа"
          />
          <Select<true, string>
            value={['money', 'packaging']}
            setValue={() => {}}
            checkbox
            items={[
              { value: 'money', label: 'Деньги' },
              { value: 'packaging', label: 'Упаковка' },
            ]}
            triggerText="Деньги/Упаковка"
          />
          <Select
            value={rowsCount}
            setValue={setRowsCount}
            items={[
              { value: 10, label: '10' },
              { value: 50, label: '50' },
              { value: 100, label: '100' },
              { value: 200, label: '200' },
              { value: 500, label: '500' },
            ]}
            triggerText="Количество строк"
          />
          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            classNames={{
              menu: 'min-w-[180px] right-0',
            }}
          />
          <ExportToExcelButton data={data} fileName="market-insights.xlsx" />
        </div>
      }
    >
      <Table<MarketRow>
        columns={columnsForTable}
        data={data}
        maxHeight={500}
        rounded="none"
      />
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
