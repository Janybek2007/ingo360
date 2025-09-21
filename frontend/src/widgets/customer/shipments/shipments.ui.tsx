import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface ShipmentRow {
  id: string;
  sku: string;
  brand: string;
  promoType: string;
  group: string;
  distributor: string;
  months: number[]; // 12 месяцев
}

// Константы для генерации
const SKUS = ['Товар 1', 'Товар 2', 'Товар 3'] as const;
const BRANDS = ['Бренд 1', 'Бренд 2', 'Бренд 3'] as const;
const PROMO_TYPES = ['Промо', 'Скидка', 'Акция'] as const;
const GROUPS = ['Группа 1', 'Группа 2'] as const;
const DISTRIBUTORS = ['Эрай', 'Альфа', 'Бета', 'Гамма'] as const;

export const Shipments: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const data = useMemo(() => {
    const allData = generateMocks(20, {
      id: () => randomId('shipment'),
      sku: SKUS,
      brand: BRANDS,
      promoType: PROMO_TYPES,
      group: GROUPS,
      distributor: DISTRIBUTORS,
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

  const columns = useMemo<ColumnDef<ShipmentRow>[]>(
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
        accessorFn: (row: ShipmentRow) => row.months[i],
        id: `month${i + 1}`,
        header: `2024`,
        meta: { width: 70 },
      })),
    ],
    []
  );

  return (
    <PageSection
      title="Отгрузки"
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
          <button className="border rounded px-2 py-1">Столбцы</button>
          <button className="border rounded px-2 py-1">
            Выгрузить в Excel
          </button>
        </div>
      }
      variant="border"
      background="default"
    >
      <Table<ShipmentRow>
        columns={columns}
        data={data}
        maxHeight={340}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

Shipments.displayName = '_Shipments_';
