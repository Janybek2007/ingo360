import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { Table } from '#/shared/components/table';
import { type ISelectItem, Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { generateMocks, randomId, randomInt } from '#/shared/utils/mock';

interface TableRow {
  place: number;
  company: string;
  sales: number;
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

type FilterPeriod = 'mat' | 'ytd' | '_month' | 'year';
const filterItems: ISelectItem<FilterPeriod>[] = [
  { label: 'MAT', value: 'mat' },
  { label: 'YTD', value: 'ytd' },
  { label: 'Месяц', value: '_month' },
  { label: 'Год', value: 'year' },
];

const PERIOD_MULTIPLIERS = {
  mat: 1.0, // MAT (Moving Annual Total) - полная годовая сумма
  ytd: 0.75, // YTD (Year To Date) - 75% от года (примерно 9 месяцев)
  _month: 0.083, // Месяц - 1/12 от года
  year: 1.0, // Год - полная сумма
};

export const LeaderBoard: React.FC = React.memo(() => {
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('mat');

  const baseData = useMemo(
    () =>
      generateMocks(50, {
        place: i => i + 1,
        id: () => randomId('leader'),
        company: COMPANIES,
        sales: () => randomInt(5000, 15000),
      }),
    []
  );

  const sectionStyle = useSectionStyle();

  const data = useMemo(() => {
    const periodMultiplier = PERIOD_MULTIPLIERS[filterPeriod];

    let processedData = baseData.map(item => ({
      ...item,
      sales: Math.round(item.sales * periodMultiplier),
    }));

    processedData = processedData.sort((a, b) => b.sales - a.sales);

    return processedData.map((item, index) => ({
      ...item,
      place: index + 1,
    }));
  }, [baseData, filterPeriod]);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      { accessorKey: 'place', header: 'Место', size: 120 },
      { accessorKey: 'company', header: 'Компания', size: 400 },
      { accessorKey: 'sales', header: 'Продажи', size: 400 },
    ],
    []
  );

  return (
    <section
      style={sectionStyle.style}
      className="bg-white rounded-lg w-full overflow-hidden"
    >
      <div className="flex items justify-between h-full font-inter">
        <div className="max-w-[30rem] min-w-[30rem] px-6 py-6 flex flex-col justify-between text-[#131313]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xl leading-full -tracking-[0.0125rem]">
                Рейтинг компаний
              </h4>
              <Select<false, typeof filterPeriod>
                value={filterPeriod}
                setValue={setFilterPeriod}
                items={filterItems}
                triggerText="Тип периода"
                classNames={{ menu: 'min-w-[7.5rem] right-0' }}
              />
            </div>
            {filterPeriod !== 'mat' && (
              <UsedFilter
                usedFilterItems={[
                  {
                    label:
                      filterItems.find(item => item.value === filterPeriod)
                        ?.label || '',
                    value: filterPeriod,
                    onDelete: () => setFilterPeriod('mat'),
                  },
                ]}
                resetFilters={() => setFilterPeriod('mat')}
              />
            )}
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
