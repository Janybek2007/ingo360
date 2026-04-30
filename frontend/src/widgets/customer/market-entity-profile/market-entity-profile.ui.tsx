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
import { getFilterItems } from '#/shared/utils/get-used-items';

import type { MarketEntityProfileProps as MarketEntityProfileProperties } from './market-entity-profile.types';

const tabItems: { value: ISMGroupColumn; label: string }[] = [
  { value: 'company', label: 'Компании' },
  { value: 'brand', label: 'Бренды' },
  { value: 'segment', label: 'Сегменты' },
];

function getActiveTabLabels(activeTab: ISMGroupColumn) {
  let header = '';
  let text = '';

  switch (activeTab) {
    case 'company': {
      header = 'Компания';
      text = 'компаний';
      break;
    }
    case 'brand': {
      header = 'Бренд';
      text = 'брендов';
      break;
    }
    case 'segment': {
      header = 'Сегмент';
      text = 'сегментов';
      break;
    }
  }

  return { header, text };
}

export const MarketEntityProfile: React.FC<MarketEntityProfileProperties> =
  React.memo(
    ({
      periodFilter,
      entities,
      isLoading,
      queryError,
      noImsPlaceholder,
      activeTab,
      setActiveTab,
      filters: databaseFilters,
      filtersState,
    }) => {
      const [filters, setFilters] = React.useState<ColumnFiltersState>([]);
      const [sorting, setSorting] = React.useState<SortingState>([]);
      const showNoImsHere = useNoImsPlaceholder(queryError);

      const { header: activeTabHeader, text: activeTabText } =
        getActiveTabLabels(activeTab);
      const columns = useMemo<ColumnDef<EntityRow>[]>(
        () => [
          { accessorKey: 'rank', header: 'Место', size: 130 },
          {
            accessorKey: 'entity',
            header: activeTabHeader,
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
        [activeTabHeader]
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
        if (noImsPlaceholder || showNoImsHere) {
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
                  row.is_user_company || row.is_user_entity
                    ? 'bg-yellow-100 font-bold'
                    : ''
                }
                isViewFilter={false}
                pinnedRow={row => row.is_user_company || row.is_user_entity}
                columns={columns}
                data={entities}
                enableColumnResizing={false}
                maxHeight={400}
              />
            </FiltersContext.Provider>
          </AsyncBoundary>
        );
      })();

      return (
        <PageSection
          title="Профайл компании, бренда или сегмента в деньгах"
          headerEnd={
            <div className="relative z-100 flex items-center gap-4">
              <DbFilters {...databaseFilters} {...filtersState} />
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
                periodCurrent={periodFilter.periodCurrent}
                usedPeriodFilters={getFilterItems([
                  {
                    value: periodFilter.selectedValues,
                    getLabelFromValue: getPeriodLabel,
                    onDelete: periodFilter.onDelete,
                  },
                ])}
                usedFilterItems={databaseFilters.usedFilterItems}
                isView={periodFilter.isView}
                isViewPeriods={periodFilter.isView}
                resetFilters={() => {
                  periodFilter.onReset();
                  filtersState.resetFilters();
                }}
                periodViewMode="from"
              />
            </div>
          }
        >
          <div className="items font-inter flex h-full justify-between">
            <div className="flex max-w-100 min-w-100 flex-col justify-between text-[#131313]">
              <h4 className="leading-full text-xl font-semibold -tracking-[0.0125rem]">
                Рейтинг {activeTabText}
              </h4>
              <div className="my-20">
                <div className="flex w-full flex-col items-center gap-4.5">
                  <span className="leading-full text-5xl font-medium -tracking-[0.0125rem]">
                    {isLoading
                      ? '-'
                      : (entities.find(
                          row => row.is_user_company || row.is_user_entity
                        )?.rank ?? '-')}
                  </span>
                  <p className="leading-full text-base font-normal -tracking-[0.0125rem]">
                    Ваше место в рейтинге
                  </p>
                </div>
              </div>
              <div></div>
            </div>
            <div className="w-full overflow-hidden">{tableContent}</div>
          </div>
        </PageSection>
      );
    }
  );

MarketEntityProfile.displayName = '_MarketEntityProfile_';
