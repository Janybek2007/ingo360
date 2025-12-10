import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { UsedFilter } from '#/shared/components/used-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import type { EntityRow } from '#/shared/types/ims';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type { LeaderboardProps } from './leader-board.types';

export const LeaderBoard: React.FC<LeaderboardProps> = React.memo(
  ({ periodFilter, entities, isLoading, queryError }) => {
    const sectionStyle = useSectionStyle();

    const columns = useMemo<ColumnDef<EntityRow>[]>(
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
                <PeriodFilters {...periodFilter} isMultiple={false} />
              </div>
              <UsedFilter
                isReadOnly
                usedPeriodFilters={getUsedFilterItems([
                  {
                    value: periodFilter.selectedValues,
                    getLabelFromValue: getPeriodLabel,
                    onDelete: periodFilter.onDelete,
                    isReadOnly: true,
                  },
                ])}
                isViewPeriods={periodFilter.isView}
                periodViewMode="from"
                resetFilters={periodFilter.onReset}
              />
            </div>
            <div className="my-20">
              <div className="flex flex-col items-center w-full gap-4.5">
                <span className="font-medium text-5xl leading-full -tracking-[0.0125rem]">
                  {entities.find(row => row.is_user_company)?.rank ?? '-'}
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
              <AsyncBoundary isLoading={isLoading} queryError={queryError}>
                <Table
                  isVirtualized={false}
                  highlightRow={row =>
                    row.is_user_company ? 'bg-yellow-100 font-bold' : ''
                  }
                  pinnedRow={row => row.is_user_company}
                  columns={columns}
                  data={entities}
                  enableColumnResizing={false}
                />
              </AsyncBoundary>
            )}
          </div>
        </div>
      </section>
    );
  }
);

LeaderBoard.displayName = '_LeaderBoard_';
