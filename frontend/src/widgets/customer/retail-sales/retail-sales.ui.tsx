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

interface RetailSalesRow {
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

export const RetailSales: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const allColumns = useMemo(
    (): ColumnDef<RetailSalesRow>[] => [
      {
        accessorKey: 'sku',
        header: 'SKU',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
        enableResizing: true,
      },
      {
        accessorKey: 'brand',
        header: 'Бренд',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
        enableResizing: true,
      },
      {
        accessorKey: 'promoType',
        header: 'Тип промоции',
        enableColumnFilter: true,
        size: 160,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
        enableResizing: true,
      },
      {
        accessorKey: 'group',
        header: 'Группа',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
        enableResizing: true,
      },
      {
        accessorKey: 'distributor',
        header: 'Дистр',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
        enablePinning: true,
        enableResizing: true,
      },
      ...Array.from({ length: 12 }, (_, i) => ({
        accessorFn: (row: RetailSalesRow) => row.months[i],
        id: `month${i + 1}`,
        header: `2024/${i + 1}`,
        size: 100,
      })),
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
    useColumnVisibility(allColumns);

  const data = useMemo(() => {
    const allData = generateMocks(10, {
      id: () => randomId('retail'),
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
  }, [search]);

  return (
    <PageSection
      beforeHeader={
        <div className="max-w-[580px]">
          <h4 className="font-semibold text-xl leading-[120%] text-black mb-2">
            Продажа товара с аптек и ЧП конечному потребителю
          </h4>
          <p className="font-normal text-sm leading-[150%] text-[#727272]">
            Бренды помесячно — в упаковках и $ + динамика отгрузок брендов, SKU.
            Остатки товара на складах, товарный запас в днях
          </p>
        </div>
      }
      title="Третичка"
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
          <ExportToExcelButton data={data} fileName="retail-sales.xlsx" />
        </div>
      }
    >
      <Table<RetailSalesRow>
        columns={columnsForTable}
        data={data}
        isScrollbar
        maxHeight={450}
        rounded="none"
      />
    </PageSection>
  );
});

RetailSales.displayName = '_RetailSales_';
