import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface NumericalDistributionRow {
  id: string;
  sku: string;
  brand: string;
  promoType: string;
  group: string;
  distributor: string;
  months: number[]; // продажи по 12 месяцам
}

// Константы для генерации
const SKUS = ['Товар 1', 'Товар 2', 'Товар 3'] as const;
const BRANDS = ['Бренд 1', 'Бренд 2', 'Бренд 3'] as const;
const PROMO_TYPES = ['Промо', 'Скидка', 'Акция'] as const;
const GROUPS = ['Группа 1', 'Группа 2'] as const;
const DISTRIBUTORS = ['Эрай', 'Альфа', 'Бета'] as const;

export const NumericalDistribution: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const allData = generateMocks(10, {
      id: () => randomId('retail'),
      sku: SKUS,
      brand: BRANDS,
      promoType: PROMO_TYPES,
      group: GROUPS,
      distributor: DISTRIBUTORS,
      months: () => randomArray(12, 5, 500), // продажи в упаковках
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

  const columns = useMemo<ColumnDef<NumericalDistributionRow>[]>(
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
        accessorFn: (row: NumericalDistributionRow) => row.months[i],
        id: `month${i + 1}`,
        header: `2024`,
        meta: { width: 70 },
      })),
    ],
    []
  );

  return (
    <PageSection
      title="Показатель нумерической дистрибуции по аптекам"
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
      <Table<NumericalDistributionRow>
        columns={columns}
        data={data}
        isScrollbar
        maxHeight={340}
        rounded="none"
      />
    </PageSection>
  );
});

NumericalDistribution.displayName = '_NumericalDistribution_';
