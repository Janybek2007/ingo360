import React from 'react';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import {
  DbFilters,
  useDbFilters,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import type { DynamicPrimarySalesData } from './dynamic-primary-sales.types';
import { DynamicPrimarySalesAsLine } from './ui/as-line.ui';
import { DynamicPrimarySalesAsMixed } from './ui/as-mixed.ui';

const AsLegends = {
  line: [],
  mixed: [
    { label: 'Первичка', fill: '#0B5A7C' },
    { label: 'Остаток', fill: '#FFC000' },
    { label: 'Товарный запас', fill: '#888888' },
  ],
};

export const DynamicPrimarySales: React.FC<{ as?: 'line' | 'mixed' }> =
  React.memo(({ as = 'line' }) => {
    const filterOptions = useFilterOptions();

    const filters = useDbFilters({
      brandsOptions: filterOptions.brands,
      groupsOptions: filterOptions.groups,
      config: {
        rowsCount: { enabled: false },
        indicator: { enabled: as == 'mixed' },
        search: { enabled: false },
      },
    });

    const periodFilter = usePeriodFilter();

    const queryData = useKeepQuery(
      DbQueries.GetDbItemsQuery<DynamicPrimarySalesData[]>(
        ['sales/primary/reports/chart'],
        {
          brand_ids: filters.brands,
          product_group_ids: filters.groups,
          group_by_period: periodFilter.period,
          period_values: periodFilter.selectedValues,
        }
      )
    );

    const resetFilters = React.useCallback(() => {
      periodFilter.onReset();
      filters.resetFilters();
    }, [periodFilter, filters]);

    return (
      <PageSection
        title={`Динамика первичных продаж в ${filters.indicator == 'amount' ? 'деньгах' : 'упаковках'}`}
        legends={AsLegends[as]}
        headerEnd={
          <div className="flex items-center gap-4">
            <DbFilters {...filters} />
            <PeriodFilters isSelectValues={as == 'mixed'} {...periodFilter} />
          </div>
        }
      >
        <AsyncBoundary
          isLoading={queryData.isLoading}
          queryError={queryData.error}
        >
          <div className="space-y-4">
            <UsedFilter
              usedFilterItems={filters.usedFilterItems}
              resetFilters={resetFilters}
              isView={filters.usedFilterItems.length > 0}
              isViewPeriods={periodFilter.isView}
              usedPeriodFilters={getUsedFilterItems([
                {
                  value: periodFilter.selectedValues,
                  getLabelFromValue: getPeriodLabel,
                  onDelete: periodFilter.onDelete,
                },
              ])}
            />

            {as == 'line' ? (
              <DynamicPrimarySalesAsLine
                sales={queryData.data?.[0] || []}
                period={periodFilter.period}
                indicator={filters.indicator}
              />
            ) : (
              <DynamicPrimarySalesAsMixed
                period={periodFilter.period}
                sales={queryData.data?.[0] || []}
                indicator={filters.indicator}
              />
            )}
          </div>
        </AsyncBoundary>
      </PageSection>
    );
  });

DynamicPrimarySales.displayName = '_DynamicPrimarySales_';
