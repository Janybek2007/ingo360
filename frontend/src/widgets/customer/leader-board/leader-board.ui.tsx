import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { UsedFilter } from '#/shared/components/used-filter';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
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

const PERIOD_MULTIPLIERS = {
  mat: 1.0, // MAT (Moving Annual Total) - полная годовая сумма
  ytd: 0.75, // YTD (Year To Date) - 75% от года (примерно 9 месяцев)
  month: 0.083, // Месяц - 1/12 от года
  year: 1.0, // Год - полная сумма,
  quarter: 0,
};

export const LeaderBoard: React.FC = React.memo(() => {
  const periodFilter = usePeriodFilter(['mat', 'ytd', 'year', 'month'], 'mat');

  const usedFilterItems = React.useMemo(() => {
    return getUsedFilterItems([
      {
        value: periodFilter.selectedValues,
        getLabelFromValue: getPeriodLabel,
        onDelete: value => {
          const newValues = periodFilter.selectedValues.filter(
            v => v !== value
          );
          periodFilter.onChange(newValues);
        },
      },
    ]);
  }, [periodFilter]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
  }, [periodFilter]);

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
    const periodMultiplier = PERIOD_MULTIPLIERS[periodFilter.period];

    let processedData = baseData.map(item => ({
      ...item,
      sales: Math.round(item.sales * periodMultiplier),
    }));

    processedData = processedData.sort((a, b) => b.sales - a.sales);

    return processedData.map((item, index) => ({
      ...item,
      place: index + 1,
    }));
  }, [baseData, periodFilter.period]);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      { accessorKey: 'place', header: 'Место', size: 130 },
      { accessorKey: 'company', header: 'Компания', size: 300 },
      { accessorKey: 'sales', header: 'Продажи', size: 300 },
    ],
    []
  );

  return (
    <section
      style={sectionStyle.style}
      className="bg-white rounded-lg w-full overflow-hidden"
    >
      <div className="flex items justify-between h-full font-inter">
        <div className="max-w-[40rem] min-w-[40rem] px-6 py-6 flex flex-col justify-between text-[#131313]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xl leading-full -tracking-[0.0125rem]">
                Рейтинг компаний
              </h4>
              <PeriodFilters {...periodFilter} />
            </div>
            <UsedFilter
              usedFilterItems={usedFilterItems}
              resetFilters={resetFilters}
            />
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
        <div className="w-full overflow-hidden">
          <Table
            highlightRow={row =>
              row.place === 1 ? 'bg-yellow-100 font-bold' : ''
            }
            pinnedRow={row => row.place === 1}
            columns={columns}
            data={data}
            enableColumnResizing={false}
          />
        </div>
      </div>
    </section>
  );
});

LeaderBoard.displayName = '_LeaderBoard_';
