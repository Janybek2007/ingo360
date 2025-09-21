import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { randomId } from '#/shared/utils/mock';

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

const SKUS = ['Товар 1', 'Товар 2', 'Товар 3', 'Товар 4', 'Товар 5'] as const;
const BRANDS = ['Бренд 1'] as const;
const PROMO_TYPES = ['Промо'] as const;
const GROUPS = ['Группа 1'] as const;
const DISTRIBUTORS = ['Эрай'] as const;

export const MarketInsights: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const allData: MarketRow[] = SKUS.map(sku => ({
      id: randomId('market'),
      sku,
      brand: BRANDS[0],
      segment: PROMO_TYPES[0],
      group: GROUPS[0],
      distributor: DISTRIBUTORS[0],
      YTD6M23: Math.floor(Math.random() * 10),
      YTD6M24: Math.floor(Math.random() * 10),
      YTD6M25: Math.floor(Math.random() * 10),
    }));

    return allData.filter(
      row =>
        row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.toLowerCase().includes(search.toLowerCase()) ||
        row.segment.toLowerCase().includes(search.toLowerCase()) ||
        row.group.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = useMemo<ColumnDef<MarketRow>[]>(
    () => [
      {
        accessorKey: 'sku',
        header: 'Компания',
        meta: { width: 134 },
        enableSorting: true,
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        meta: { width: 134 },
        enableSorting: true,
      },
      {
        accessorKey: 'segment',
        header: 'Сегмент',
        meta: { width: 134 },
        enableSorting: true,
      },
      {
        accessorKey: 'group',
        header: 'Форма выписка',
        meta: { width: 134 },
        enableSorting: true,
      },
      {
        accessorKey: 'distributor',
        header: 'Дозировка',
        meta: { width: 134 },
        enableSorting: true,
      },
      {
        accessorKey: 'YTD6M23',
        header: 'YTD-6M-23',
        meta: { width: 134 },
        enableSorting: true,
      },
      {
        accessorKey: 'YTD6M24',
        header: 'YTD-6M-24',
        meta: { width: 134 },
        enableSorting: true,
      },
      {
        accessorKey: 'YTD6M25',
        header: 'YTD-6M-25',
        meta: { width: 134 },
        enableSorting: true,
      },
    ],
    []
  );

  return (
    <PageSection
      title="Данные по рынкам"
      variant="background"
      background="white"
      headerEnd={
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button className="border rounded px-2 py-1">Фильтр</button>
          <button className="border rounded px-2 py-1">Столбцы</button>
          <button className="border rounded px-2 py-1">
            Выгрузить в Excel
          </button>
        </div>
      }
    >
      <Table<MarketRow>
        columns={columns}
        data={data}
        isScrollbar
        maxHeight={340}
        rounded="none"
      />
    </PageSection>
  );
});

MarketInsights.displayName = '_MarketInsights_';
