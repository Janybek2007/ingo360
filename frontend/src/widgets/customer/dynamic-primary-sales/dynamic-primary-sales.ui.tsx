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
import type { ExtraDbType } from '#/shared/types/db.type';

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

const asUrls: Record<'line' | 'mixed', ExtraDbType[]> = {
  line: ['sales/primary/reports/sales'],
  mixed: [
    'sales/primary/reports/sales', // primary
    'sales/primary/reports/stock-coverages', // inventory
    'sales/primary/reports/stock-levels', // stocks
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
      },
    });

    const periodFilter = usePeriodFilter();

    const queryData = useKeepQuery(
      DbQueries.GetDbItemsQuery<DynamicPrimarySalesData[]>(asUrls[as], {
        brand_ids: filters.values.brands,
        product_group_ids: filters.values.groups,
      })
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
          isEmpty={queryData.data?.length === 0}
          queryError={queryData.error}
        >
          <div className="space-y-4">
            <UsedFilter
              usedFilterItems={filters.usedFilterItems}
              resetFilters={resetFilters}
              isView={filters.usedFilterItems.length > 0}
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
                sales={{
                  sales: queryData.data?.[0] || [],
                  inventory: queryData.data?.[1] || [],
                  stocks: queryData.data?.[2] || [],
                }}
                selectedValues={periodFilter.selectedValues}
                indicator={filters.indicator}
              />
            )}
          </div>
        </AsyncBoundary>
      </PageSection>
    );
  });

DynamicPrimarySales.displayName = '_DynamicPrimarySales_';
