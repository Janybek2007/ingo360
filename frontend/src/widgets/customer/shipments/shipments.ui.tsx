import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
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

export const Shipments: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const allColumns: ColumnDef<ShipmentRow>[] = useMemo(
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
        header: '2024',
        meta: { width: 70 },
      })),
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility(allColumns);

  const data = useMemo(() => {
    const allData = generateMocks(20, {
      id: () => randomId('shipment'),
      sku: ['Товар 1', 'Товар 2', 'Товар 3'],
      brand: ['Бренд 1', 'Бренд 2', 'Бренд 3'],
      promoType: ['Промо', 'Скидка', 'Акция'],
      group: ['Группа 1', 'Группа 2'],
      distributor: ['Эрай', 'Альфа', 'Бета', 'Гамма'],
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

  return (
    <PageSection
      title="Отгрузки"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
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
          <ExportToExcelButton data={data} fileName="shipments.xlsx" />
        </div>
      }
    >
      <Table<ShipmentRow>
        columns={columnsForTable}
        data={data}
        maxHeight={340}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

Shipments.displayName = '_Shipments_';
