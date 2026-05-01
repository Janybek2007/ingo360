import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { AsyncBoundary } from '#/shared/components/async-boundry';
import { NoImsPlaceholder } from '#/shared/components/no-ims-placeholder';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { UsedFilter } from '#/shared/components/used-filter';
import { FiltersContext } from '#/shared/context/filters';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import type { EntityRow } from '#/shared/types/ims';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getFilterItems } from '#/shared/utils/get-used-items';

import type { LeaderboardProps as LeaderboardProperties } from './leader-board.types';

export const LeaderBoard: React.FC<LeaderboardProperties> = React.memo(
  ({ periodFilter, entities, isLoading, queryError, noImsPlaceholder }) => {
    const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

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
              maximumFractionDigits: 0,
            }),
        },
      ],
      []
    );

    const tableContent = (() => {
      if (periodFilter.selectedValues.length === 0) {
        return (
          <div className="my-32">
            <p className="p-10 text-center text-gray-500">
              Пожалуйста, выберите период для отображения данных рейтинга.
            </p>
          </div>
        );
      }
      if (noImsPlaceholder) {
        return (
          <div className="my-8">
            <NoImsPlaceholder />
          </div>
        );
      }
      return (
        <AsyncBoundary isLoading={isLoading} queryError={queryError}>
          <FiltersContext.Provider
            value={{ filters, setFilters, sorting, setSorting }}
          >
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
          </FiltersContext.Provider>
        </AsyncBoundary>
      );
    })();

    return (
      <section
        style={sectionStyle.style}
        className="w-full overflow-hidden rounded-lg bg-white"
      >
        <div className="items font-inter flex h-full justify-between">
          <div className="flex max-w-160 min-w-160 flex-col justify-between px-6 py-6 text-[#131313]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="leading-full text-xl font-semibold -tracking-[0.0125rem]">
                  Рейтинг компаний
                </h4>
                <PeriodFilters {...periodFilter} isMultiple={false} />
              </div>
              <UsedFilter
                isReadOnly
                usedPeriodFilters={getFilterItems([
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
              <div className="flex w-full flex-col items-center gap-4.5">
                <span className="leading-full text-5xl font-medium -tracking-[0.0125rem]">
                  {entities.find(row => row.is_user_company)?.rank ?? '-'}
                </span>
                <p className="leading-full text-base font-normal -tracking-[0.0125rem]">
                  Ваше место в рейтинге
                </p>
              </div>
            </div>
            <div></div>
          </div>
          <div className="w-full overflow-hidden">{tableContent}</div>;
        </div>
      </section>
    );
  }
);

LeaderBoard.displayName = '_LeaderBoard_';
