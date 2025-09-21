import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { PageSection } from '#/shared/components/page-section';
import { Table } from '#/shared/components/table';
import { Tabs } from '#/shared/components/ui/tabs';
import { generateMocks, randomId } from '#/shared/utils/mock';

const ETabs = {
  COMPANIES: 'companies',
  BRANDS: 'brands',
  SEGMENTS: 'segments',
} as const;

interface TableRow {
  place: number;
  company: string;
  sales: number;
  status: string;
  lapseTime: string;
}

const COMPANIES = [
  'Google',
  'Apple',
  'Microsoft',
  'Amazon',
  'Tesla',
  'Meta',
  'Adobe',
  'Samsung',
  'Nike',
  'Coca-Cola',
] as const;

const STATUSES = ['Active', 'Pending', 'Inactive', 'Completed'] as const;

export const MarketEntityProfile: React.FC = React.memo(() => {
  const tabItems = [
    { value: ETabs.COMPANIES, label: 'Компании' },
    { value: ETabs.BRANDS, label: 'Бренды' },
    { value: ETabs.SEGMENTS, label: 'Сегменты' },
  ];

  const data = useMemo(
    () =>
      generateMocks(100, {
        place: i => i + 1,
        id: () => randomId('leader'),
        company: COMPANIES,
        sales: () => Math.floor(Math.random() * 10000),
        status: STATUSES,
        lapseTime: () =>
          `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      }),
    []
  );

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      { accessorKey: 'place', header: 'Место', meta: { width: 59 } },
      { accessorKey: 'company', header: 'Компания', meta: { width: 100 } },
      { accessorKey: 'sales', header: 'Сумма продаж', meta: { width: 100 } },
      { accessorKey: 'status', header: 'Статус', meta: { width: 100 } },
      {
        accessorKey: 'lapseTime',
        header: 'Время истечения',
        meta: { width: 120 },
      },
    ],
    []
  );

  return (
    <PageSection
      title="Профайл компании, бренда или сегмента"
      headerEnd={
        <div className="flex gap-4 items-center">
          <button className="border rounded px-2 py-1">Тип компании</button>
          <button className="border rounded px-2 py-1">Период</button>
          <button className="border rounded px-2 py-1">Топ 10</button>
        </div>
      }
      classNames={{ wrapper: 'gap-3' }}
      afterHeader={
        <Tabs
          classNames={{ tabs: 'p-0 rounded-none border-none' }}
          items={tabItems}
        />
      }
    >
      <div className="flex items justify-between h-full font-inter">
        <div className="max-w-[340px] min-w-[340px] flex flex-col justify-between text-[#131313]">
          <h4 className="font-semibold text-xl leading-full -tracking-[0.2px]">
            Рейтинг компаний
          </h4>
          <div>
            <div className="flex flex-col items-center w-full gap-[18px]">
              <span className="font-medium text-5xl leading-full -tracking-[0.2px]">
                34
              </span>
              <p className="font-normal text-base leading-full -tracking-[0.2px]">
                Ваше место в рейтинге
              </p>
            </div>
          </div>
          <div></div>
        </div>
        <div className="w-full">
          <Table<TableRow>
            highlightRow={row =>
              row.place === 34 ? 'bg-yellow-100 font-bold' : ''
            }
            columns={columns}
            maxHeight={300}
            data={data}
          />
        </div>
      </div>
    </PageSection>
  );
});

MarketEntityProfile.displayName = '_MarketEntityProfile_';
