import { type ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { ExportToExcelButton } from '#/shared/components/export-to-excel';
import { PageSection } from '#/shared/components/page-section';
import { SearchInput } from '#/shared/components/search-input';
import { Table } from '#/shared/components/table';
import { Select } from '#/shared/components/ui/select';
import { useColumnVisibility } from '#/shared/hooks/use-column-visibility';
import { stringFilter } from '#/shared/utils/filter';

interface DistributorSalesRow {
  distributor: string;
  months: number[]; // 12 месяцев
}

const distributors = ['Эрай', 'Неман', 'Медсервис', 'Димед', 'Эляй', 'Бимед'];

const generateDummyData = (): DistributorSalesRow[] => {
  return distributors.map(d => ({
    distributor: d,
    months: Array.from({ length: 12 }, (_, i) => i + 1),
  }));
};

export const DistributorSales: React.FC = React.memo(() => {
  const [search, setSearch] = useState('');

  const allColumns = useMemo<ColumnDef<DistributorSalesRow>[]>(
    () => [
      {
        accessorKey: 'distributor',
        header: 'Дистр',
        enableColumnFilter: true,
        size: 120,
        filterFn: stringFilter(),
        type: 'string',
      },
      ...Array.from({ length: 12 }, (_, i) => ({
        accessorFn: (row: DistributorSalesRow) => row.months[i],
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
    const allData = generateDummyData();
    return allData.filter(row =>
      row.distributor.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <PageSection
      title="Продажа по дистрам"
      headerEnd={
        <div className="flex items-center gap-4 relative z-100">
          <SearchInput saveValue={setSearch} />
          <Select<true>
            value={visibleColumns}
            setValue={setVisibleColumns}
            items={columnItems}
            triggerText="Столбцы"
            checkbox
            classNames={{ menu: 'min-w-[180px] right-0' }}
          />
          <ExportToExcelButton data={data} fileName="distributor-sales.xlsx" />
        </div>
      }
    >
      <Table<DistributorSalesRow>
        columns={columnsForTable}
        data={data}
        maxHeight={340}
        isScrollbar
        rounded="none"
      />
    </PageSection>
  );
});

DistributorSales.displayName = '_DistributorSales_';
