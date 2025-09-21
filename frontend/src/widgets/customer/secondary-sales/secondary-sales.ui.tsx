import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface SecondarySalesRow {
  id: string;
  sku: string;
  brand: string;
  promoType: string;
  group: string;
  distributor: string;
  months: number[];
}

export const SecondarySales: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const allData = generateMocks(20, {
      id: () => randomId('sku'),
      sku: ['Товар 1', 'Товар 2', 'Товар 3', 'Товар 4'] as const,
      brand: ['Бренд A', 'Бренд B', 'Бренд C'] as const,
      promoType: ['Промо', 'Скидка', 'Акция'] as const,
      group: ['Группа 1', 'Группа 2'] as const,
      distributor: ['Эрай', 'Альфа', 'Бета', 'Гамма'] as const,
      months: () => randomArray(12, 10, 500),
    });

    return allData.filter(
      row =>
        row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.toLowerCase().includes(search.toLowerCase()) ||
        row.promoType.toLowerCase().includes(search.toLowerCase()) ||
        row.group.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = useMemo<ColumnDef<SecondarySalesRow>[]>(
    () => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        enableSorting: true,
        meta: { width: 120 },
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        enableSorting: true,
        meta: { width: 120 },
      },
      {
        accessorKey: 'promoType',
        header: 'Тип промоции',
        enableSorting: true,
        meta: { width: 140 },
      },
      {
        accessorKey: 'group',
        header: 'Группа',
        enableSorting: true,
        meta: { width: 120 },
      },
      {
        accessorKey: 'distributor',
        header: 'Дистр',
        enableSorting: true,
        meta: { width: 120 },
      },
      ...Array.from({ length: 12 }, (_, i) => ({
        accessorFn: (row: SecondarySalesRow) => row.months[i],
        id: `month${i + 1}`,
        header: `2024`,
        meta: { width: 70 },
      })),
    ],
    []
  );

  return (
    <PageSection
      title="Продажа"
      classNames={{ title: 'font-medium' }}
      headerEnd={
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button className="border rounded px-2 py-1">Фильтр</button>
          <button className="border rounded px-2 py-1">
            Выгрузить в Excel
          </button>
        </div>
      }
      variant="background"
      background="white"
    >
      <Table<SecondarySalesRow>
        columns={columns}
        data={data}
        isScrollbar
        maxHeight={340}
        rounded="none"
      />
    </PageSection>
  );
});

SecondarySales.displayName = '_SecondarySales_';
