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

  const allColumns = useMemo<ColumnDef<SecondarySalesRow>[]>(
    () => [
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
        accessorKey: 'promoType',
        header: 'Тип промоции',
        enableColumnFilter: true,
        size: 140,
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
        accessorFn: (row: SecondarySalesRow) => row.months[i],
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

  return (
    <PageSection
      title="Продажа"
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
          <ExportToExcelButton data={data} fileName="secondary-sales.xlsx" />
        </div>
      }
    >
      <Table<SecondarySalesRow>
        columns={columnsForTable}
        data={data}
        maxHeight={340}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

SecondarySales.displayName = '_SecondarySales_';
