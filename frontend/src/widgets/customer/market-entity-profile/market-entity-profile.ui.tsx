import type { ColumnDef } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { Tabs } from '#/shared/components/ui/tabs';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { type UsePeriodFilterReturn } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

type ETabs = 'company' | 'brand' | 'segment';

const tabItems: { value: ETabs; label: string }[] = [
  { value: 'company', label: 'Компании' },
  { value: 'brand', label: 'Бренды' },
  { value: 'segment', label: 'Сегменты' },
];

interface LeaderBoardRow {
  rank: number;
  entity: string;
  sales: number;
  is_user_company: boolean;
}

export const MarketEntityProfile: React.FC<{
  periodFilter: UsePeriodFilterReturn;
}> = React.memo(({ periodFilter }) => {
  const [activeTab, setActiveTab] = useState<ETabs>('company');

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<LeaderBoardRow[]>(['ims/reports/top'], {
      periods: periodFilter.selectedValues,
      type_period: periodFilter.period,
      limit: 300,
      group_column: activeTab as 'company',
    })
  );

  const metricData = React.useMemo(() => {
    return queryData.data ? queryData.data[0] : [];
  }, [queryData.data]);

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
    <PageSection
      title="Профайл компании, бренда или сегмента"
      headerEnd={
        <div className="flex gap-4 items-center relative z-100">
          <PeriodFilters {...periodFilter} />
        </div>
      }
      classNames={{ wrapper: 'gap-3' }}
      afterHeader={
        <div className="mb-4">
          <Tabs
            saveCurrent={current => setActiveTab(current as ETabs)}
            classNames={{ tabs: 'p-0 rounded-none border-none' }}
            items={tabItems}
          />
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
            resetFilters={periodFilter.onReset}
            periodViewMode="from"
          />
        </div>
      }
    >
      <div className="flex items justify-between h-full font-inter">
        <div className="max-w-100 min-w-100 flex flex-col justify-between text-[#131313]">
          <h4 className="font-semibold text-xl leading-full -tracking-[0.0125rem]">
            Рейтинг{' '}
            {activeTab === 'company'
              ? 'компаний'
              : activeTab === 'brand'
                ? 'брендов'
                : 'сегментов'}
          </h4>
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
              isLoading={queryData.isLoading}
              queryError={queryData.error}
              isEmpty={metricData.length === 0}
            >
              <Table
                highlightRow={row =>
                  row.is_user_company ? 'bg-yellow-100 font-bold' : ''
                }
                pinnedRow={row => row.is_user_company}
                columns={columns}
                data={metricData}
                enableColumnResizing={false}
                maxHeight={400}
                isVirtualized={false}
              />
            </AsyncBoundary>
          )}
        </div>
      </div>
    </PageSection>
  );
});

MarketEntityProfile.displayName = '_MarketEntityProfile_';
