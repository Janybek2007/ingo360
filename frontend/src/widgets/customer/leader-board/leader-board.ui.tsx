import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { type UsePeriodFilterReturn } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

interface LeaderBoardRow {
  rank: number;
  entity: string;
  sales: number;
  is_user_company: boolean;
}

export const LeaderBoard: React.FC<{ periodFilter: UsePeriodFilterReturn }> =
  React.memo(({ periodFilter }) => {
    const queryData = useKeepQuery(
      DbQueries.GetDbItemsQuery<LeaderBoardRow[]>(['ims/reports/top'], {
        periods: periodFilter.selectedValues,
        type_period: periodFilter.period,
        limit: 1000,
      })
    );

    const metricData = React.useMemo(() => {
      return queryData.data ? queryData.data[0] : [];
    }, [queryData.data]);

    const sectionStyle = useSectionStyle();

    const columns = useMemo<ColumnDef<LeaderBoardRow>[]>(
      () => [
        { accessorKey: 'rank', header: 'Место', size: 130 },
        { accessorKey: 'entity', header: 'Компания', size: 300 },
        {
          accessorKey: 'sales',
          header: 'Продажи',
          size: 300,
          cell: ({ row }) =>
            row.original.sales.toLocaleString('ru-RU', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }),
        },
      ],
      []
    );

    return (
      <section
        style={sectionStyle.style}
        className="bg-white rounded-lg w-full overflow-hidden"
      >
        <div className="flex items justify-between h-full font-inter">
          <div className="max-w-160 min-w-160 px-6 py-6 flex flex-col justify-between text-[#131313]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xl leading-full -tracking-[0.0125rem]">
                  Рейтинг компаний
                </h4>
                <PeriodFilters {...periodFilter} />
              </div>
              <UsedFilter
                usedPeriodFilters={getUsedFilterItems([
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
                ])}
                isViewPeriods={periodFilter.isView}
                periodViewMode="from"
                resetFilters={periodFilter.onReset}
              />
            </div>
            <div>
              <div className="flex flex-col items-center w-full gap-4.5">
                <span className="font-medium text-5xl leading-full -tracking-[0.0125rem]">
                  {metricData.find(row => row.is_user_company)?.rank ?? '-'}
                </span>
                <p className="font-normal text-base leading-full -tracking-[0.0125rem]">
                  Ваше место в рейтинге
                </p>
              </div>
            </div>
            <div></div>
          </div>
          <div className="w-full overflow-hidden">
            {periodFilter.selectedValues.length === 0 ? (
              <div className="my-32">
                <p className="p-10 text-center text-gray-500">
                  Пожалуйста, выберите период для отображения данных рейтинга.
                </p>
              </div>
            ) : (
              <AsyncBoundary
                isLoading={queryData.isLoading || queryData.isFetching}
                isEmpty={metricData.length === 0}
                queryError={queryData.error}
              >
                <Table
                  highlightRow={row =>
                    row.is_user_company ? 'bg-yellow-100 font-bold' : ''
                  }
                  pinnedRow={row => row.is_user_company}
                  columns={columns}
                  data={metricData}
                  enableColumnResizing={false}
                  isVirtualized={false}
                />
              </AsyncBoundary>
            )}
          </div>
        </div>
      </section>
    );
  });

LeaderBoard.displayName = '_LeaderBoard_';
