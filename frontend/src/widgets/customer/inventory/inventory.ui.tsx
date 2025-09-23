import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { stringFilter } from '#/shared/utils/filter';
import { generateMocks, randomArray, randomId } from '#/shared/utils/mock';

interface InventoryRow {
  id: string;
  sku: string;
  brand: string;
  group: string;
  distributor: string;
  months: number[];
}

const SKUS = ['Товар 1', 'Товар 2', 'Товар 3'] as const;
const BRANDS = ['Бренд 1', 'Бренд 2', 'Бренд 3'] as const;
const GROUPS = ['Группа 1', 'Группа 2'] as const;
const DISTRIBUTORS = ['Эрай', 'Альфа', 'Бета'] as const;

export const Inventory: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const allColumns = useMemo(
    (): ColumnDef<InventoryRow>[] => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'group',
        header: 'Группа',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
      },
      {
        accessorKey: 'distributor',
        header: 'Дистр',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
      },
      ...Array.from({ length: 12 }, (_, i) => ({
        accessorFn: (row: InventoryRow) => row.months[i],
        id: `month${i + 1}`,
        header: `2024/${i + 1}`,
        size: 100,
      })),
    ],
    []
  );

  const { visibleColumns, setVisibleColumns, columnsForTable, columnItems } =
    useColumnVisibility(allColumns);

  const data = useMemo(() => {
    const allData = generateMocks(10, {
      id: () => randomId('inventory'),
      sku: SKUS,
      brand: BRANDS,
      group: GROUPS,
      distributor: DISTRIBUTORS,
      months: () => randomArray(12, 40, 60),
    });

    return allData.filter(
      row =>
        row.sku.toLowerCase().includes(search.toLowerCase()) ||
        row.brand.toLowerCase().includes(search.toLowerCase()) ||
        row.group.toLowerCase().includes(search.toLowerCase()) ||
        row.distributor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <PageSection
      title="Товарный запас"
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
          <ExportToExcelButton data={data} fileName="inventory.xlsx" />
        </div>
      }
    >
      <Table<InventoryRow>
        columns={columnsForTable}
        data={data}
        isScrollbar
        maxHeight={320}
        rounded="none"
      />
    </PageSection>
  );
});

Inventory.displayName = '_Inventory_';
