import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { Table } from '#/shared/components/table';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

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

export const LeaderBoard: React.FC = React.memo(() => {
  const data = useMemo(
    () =>
      generateMocks(100, {
        place: i => i + 1,
        id: () => randomId('leader'),
        company: COMPANIES,
        sales: () => randomInt(0, 10000),
        status: STATUSES,
        lapseTime: () => `${randomInt(0, 24)}h ${randomInt(0, 60)}m`,
      }),
    []
  );

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      { accessorKey: 'place', header: 'Место', size: 320 },
      { accessorKey: 'company', header: 'Компания', size: 410 },
      { accessorKey: 'sales', header: 'Продажи', size: 410 },
    ],
    []
  );

  return (
    <section className="bg-white rounded-lg">
      <div className="flex items justify-between h-full font-inter">
        <div className="max-w-[25rem] min-w-[25rem] px-6 py-6 flex flex-col justify-between text-[#131313]">
          <div className="flex items-center">
            <h4 className="font-semibold text-xl leading-full -tracking-[0.0125rem]">
              Рейтинг компаний
            </h4>
          </div>
          <div>
            <div className="flex flex-col items-center w-full gap-[1.125rem]">
              <span className="font-medium text-5xl leading-full -tracking-[0.0125rem]">
                1
              </span>
              <p className="font-normal text-base leading-full -tracking-[0.0125rem]">
                Ваше место в рейтинге
              </p>
            </div>
          </div>
          <div></div>
        </div>
        <div className="w-full">
          <Table
            highlightRow={row =>
              row.place === 1 ? 'bg-yellow-100 font-bold' : ''
            }
            pinnedRow={row => row.place === 1}
            columns={columns}
            data={data}
          />
        </div>
      </div>
    </section>
  );
});

LeaderBoard.displayName = '_LeaderBoard_';
