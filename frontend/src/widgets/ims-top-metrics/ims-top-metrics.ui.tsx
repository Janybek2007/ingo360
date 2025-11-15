import React from 'react';

import { DbQueries } from '#/entities/db';
import { useDbFilters, useFilterOptions } from '#/shared/components/db-filters';
import { LazySection } from '#/shared/components/lazy-section';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import type { ISMGroupColumn } from '#/shared/types/ims';

import { IMSMetrics } from '../customer/ims-metrics';
import { LeaderBoard } from '../customer/leader-board';
import { MarketEntityProfile } from '../customer/market-entity-profile';
import type { TopMetricsRow } from './ims-top-metrics.types';

export const IMSTopMetrics: React.FC<{ isMarketDevelopmentPage?: boolean }> =
  React.memo(({ isMarketDevelopmentPage = false }) => {
    const [activeTab, setActiveTab] = React.useState<ISMGroupColumn>('company');
    const isBrandEnabled = activeTab === 'brand' && isMarketDevelopmentPage;
    const isSegmentEnabled = activeTab === 'segment' && isMarketDevelopmentPage;

    const filterOptions = useFilterOptions({
      groups: false,
      segment: isSegmentEnabled,
      brands: isBrandEnabled,
      urls: { brands: 'ims/filter-options/brand-name' },
    });
    const filters = useDbFilters({
      brandsOptions: filterOptions.brands,
      segmentsOptions: filterOptions.segments,
      config: {
        groups: { enabled: false },
        search: { enabled: false },
        indicator: { enabled: false },
        rowsCount: { enabled: false },
        segment: { enabled: isSegmentEnabled },
        brands: { enabled: isBrandEnabled, multiple: false },
      },
    });

    const periodFilter = usePeriodFilter(
      ['mat', 'ytd', 'year', 'month'],
      'mat'
    );

    const queryData = useKeepQuery(
      DbQueries.GetDbItemsQuery<TopMetricsRow>(['ims/reports/top'], {
        periods: periodFilter.selectedValues,
        group_by_period: periodFilter.period,
        group_column: isMarketDevelopmentPage ? activeTab : 'company',
        segment_name: filters.segment ?? undefined,
        brand_name: String(filters.brands[0]) ?? undefined,
        enabled: !filterOptions.isLoading,
      })
    );

    const metricData = React.useMemo(() => {
      return queryData.data ? queryData.data[0] : null;
    }, [queryData.data]);

    return (
      <>
        {isMarketDevelopmentPage ? (
          <LazySection>
            <MarketEntityProfile
              filters={filters}
              periodFilter={periodFilter}
              isLoading={queryData.isLoading}
              queryError={queryData.error}
              entities={metricData?.entities ?? []}
              activeTab={activeTab}
              setActiveTab={v => {
                setActiveTab(v);
                filters.resetFilters();
              }}
            />
          </LazySection>
        ) : (
          <LazySection>
            <LeaderBoard
              periodFilter={periodFilter}
              isLoading={queryData.isLoading}
              queryError={queryData.error}
              entities={metricData?.entities ?? []}
            />
          </LazySection>
        )}
        <LazySection>
          <IMSMetrics
            metricData={metricData?.metrics}
            isLoading={queryData.isLoading}
            queryError={queryData.error}
            periodFilter={{
              period: periodFilter.period,
              selectedValues: periodFilter.selectedValues,
            }}
          />
        </LazySection>
      </>
    );
  });

IMSTopMetrics.displayName = '_IMSTopMetrics_';
