import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { AsyncBoundary } from '#/shared/components/async-boundry';
import { DbFilters } from '#/shared/components/db-filters';
import { NoImsPlaceholder } from '#/shared/components/no-ims-placeholder';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Table } from '#/shared/components/table';
import { Tabs } from '#/shared/components/ui/tabs';
import { UsedFilter } from '#/shared/components/used-filter';
import { FiltersContext } from '#/shared/context/filters';
import { useNoImsPlaceholder } from '#/shared/hooks/use-no-ims-placeholder';
import type { EntityRow, ISMGroupColumn } from '#/shared/types/ims';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type { MarketEntityProfileProps } from './market-entity-profile.types';

const tabItems: { value: ISMGroupColumn; label: string }[] = [
  { value: 'company', label: 'Компании' },
  { value: 'brand', label: 'Бренды' },
  { value: 'segment', label: 'Сегменты' },
];

export const MarketEntityProfile: React.FC<MarketEntityProfileProps> =
  React.memo(
    ({
      periodFilter,
      entities,
      isLoading,
      queryError,
      noImsPlaceholder,
      activeTab,
      setActiveTab,
      filters: dbFilters,
    }) => {
      const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
      const [sorting, setSorting] = React.useState<SortingState>([]);
      const showNoImsHere = useNoImsPlaceholder(queryError);

      const columns = useMemo<ColumnDef<EntityRow>[]>(
        () => [
          { accessorKey: 'rank', header: 'Место', size: 130 },
          {
            accessorKey: 'entity',
            header:
              activeTab == 'company'
                ? 'Компания'
                : activeTab == 'brand'
                  ? 'Бренд'
                  : 'Сегмент',
            size: 300,
            cell: ({ row }) =>
              React.createElement(
                'span',
                { title: row.original.entity },
                row.original.entity
              ),
          },
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
        [activeTab]
      );

      return (
        <PageSection
          title="Профайл компании, бренда или сегмента"
          headerEnd={
            <div className="flex gap-4 items-center relative z-100">
              <DbFilters {...dbFilters} brandsMultiple={false} />
              <PeriodFilters {...periodFilter} isMultiple={false} />
            </div>
          }
          classNames={{ wrapper: 'gap-3' }}
          afterHeader={
            <div className="mb-4">
              <Tabs
                saveCurrent={current => setActiveTab(current as ISMGroupColumn)}
                classNames={{ tabs: 'p-0 rounded-none border-none' }}
                items={tabItems}
              />
              <UsedFilter
                className="mt-4"
                isReadOnly
                usedPeriodFilters={getUsedFilterItems([
                  {
                    value: periodFilter.selectedValues,
                    getLabelFromValue: getPeriodLabel,
                    onDelete: periodFilter.onDelete,
                    isReadOnly: true,
                  },
                ])}
                usedFilterItems={dbFilters.usedFilterItems}
                isView={periodFilter.isView}
                isViewPeriods={periodFilter.isView}
                resetFilters={() => {
                  periodFilter.onReset();
                  dbFilters.resetFilters();
                }}
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
              <div className="my-20">
                <div className="flex flex-col items-center w-full gap-4.5">
                  <span className="font-medium text-5xl leading-full -tracking-[0.0125rem]">
                    {isLoading
                      ? '-'
                      : (entities.find(
                          row => row.is_user_company || row.is_user_entity
                        )?.rank ?? '-')}
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
              ) : noImsPlaceholder || showNoImsHere ? (
                <div className="my-8">
                  <NoImsPlaceholder />
                </div>
              ) : (
                <AsyncBoundary isLoading={isLoading} queryError={queryError}>
                  <FiltersContext.Provider
                    value={{ filters, setFilters, sorting, setSorting }}
                  >
                    <Table
                      isVirtualized={false}
                      highlightRow={row =>
                        row.is_user_company || row.is_user_entity
                          ? 'bg-yellow-100 font-bold'
                          : ''
                      }
                      // isVirtualized={false}
                      isViewFilter={false}
                      pinnedRow={row =>
                        row.is_user_company || row.is_user_entity
                      }
                      columns={columns}
                      data={entities}
                      enableColumnResizing={false}
                      maxHeight={400}
                    />
                  </FiltersContext.Provider>
                </AsyncBoundary>
              )}
            </div>
          </div>
        </PageSection>
      );
    }
  );

MarketEntityProfile.displayName = '_MarketEntityProfile_';
