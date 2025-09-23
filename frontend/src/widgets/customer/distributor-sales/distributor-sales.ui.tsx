import { type ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';

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
  const data = useMemo(() => {
    const allData = generateDummyData();
    return allData.filter(row => row.distributor.includes(search));
  }, [search]);

  const columns = useMemo<ColumnDef<DistributorSalesRow>[]>(
    () => [
      {
        accessorKey: 'distributor',
        header: 'Дистр',
        enableSorting: true,
        size: 120,
      },
      ...Array.from({ length: 12 }, (_, i) => ({
        accessorFn: (row: DistributorSalesRow) => row.months[i],
        id: `month${i + 1}`,
        header: `2024`,
        size: 70,
      })),
    ],
    []
  );

  return (
    <PageSection
      title="Продажа по дистрам"
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
          <button className="border rounded px-2 py-1">
            Выгрузить в Excel
          </button>
        </div>
      }
    >
      <Table<DistributorSalesRow> columns={columns} data={data} />
    </PageSection>
  );
});

DistributorSales.displayName = '_DistributorSales_';
