import React from 'react';

import { DbQueries } from '#/entities/db';
import {
  useDbFilters,
  useDbFiltersState,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { LazySection } from '#/shared/components/lazy-section';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { useNoImsPlaceholder } from '#/shared/hooks/use-no-ims-placeholder';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSession } from '#/shared/session';
import type { ISMGroupColumn } from '#/shared/types/ims';

import { IMSMetrics } from '../customer/ims-metrics';
import { LeaderBoard } from '../customer/leader-board';
import { MarketEntityProfile } from '../customer/market-entity-profile';
import type { TopMetricsRow } from './ims-top-metrics.types';

export const IMSTopMetrics: React.FC<{ isMarketDevelopmentPage?: boolean }> =
  React.memo(({ isMarketDevelopmentPage = false }) => {
    const [activeTab, setActiveTab] = React.useState<ISMGroupColumn>('company');
    const isBrandEnabled = activeTab === 'brand' && isMarketDevelopmentPage;

    const isSegmentsEnabled =
      ['brand', 'company'].includes(activeTab) && isMarketDevelopmentPage;

    const [brands, setBrands] = React.useState<string[]>([]);
    const [segments, setSegments] = React.useState<string[]>([]);

    const lastYear = useSession(s => s.lastYear);
    const filterOptions = useFilterOptions(
      isSegmentsEnabled ? ['ims_segment_names'] : []
    );

    const filtersState = useDbFiltersState({
      groups: { enabled: false },
      search: { enabled: false },
      indicator: { enabled: false },
      rowsCount: { enabled: false },
      segments: { enabled: true, multiple: isSegmentsEnabled },
      brands: { enabled: isBrandEnabled, multiple: false },
    });

    const filters = useDbFilters({
      state: filtersState,
      brandsOptions: brands.map(brand => ({ label: brand, value: brand })),
      segmentsOptions: isSegmentsEnabled
        ? filterOptions.options.ims_segment_names
        : segments.map(segment => ({
            label: segment,
            value: segment,
          })),
    });

    const periodFilter = usePeriodFilter({
      views: ['mat', 'ytd', 'year', 'month'],
      defaultPeriod: 'mat',
      isMultiple: false,
      lastYear: lastYear?.ims ?? undefined,
    });

    const queryData = useKeepQuery(
      DbQueries.GetDbItemsQuery<TopMetricsRow>(['ims/reports/top'], {
        period_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,
        group_column: isMarketDevelopmentPage ? activeTab : 'company',
        segment_name: String(filtersState.segments[0]) ?? undefined,
        segments: filtersState.segments ?? undefined,
        brand_name: String(filtersState.brands[0]) ?? undefined,
        //
        method: 'POST',
        enabled: !filterOptions.isLoading,
      })
    );
    const metricData = React.useMemo(() => {
      return queryData.data ? queryData.data[0] : null;
    }, [queryData.data]);

    const showNoImsPlaceholder = useNoImsPlaceholder(queryData.error);

    React.useEffect(() => {
      if (queryData.isLoading || !queryData.data) return;
      const data = queryData.data[0];
      if (activeTab === 'brand') {
        setBrands([
          ...new Set(data.entities.map(item => item.entity)).values(),
        ]);
      } else if (activeTab === 'segment') {
        setSegments([
          ...new Set(data.entities.map(item => item.entity)).values(),
        ]);
      }
    }, [activeTab, queryData.data, queryData.isLoading]);

    return (
      <>
        {isMarketDevelopmentPage ? (
          <LazySection>
            <MarketEntityProfile
              filters={filters}
              filtersState={filtersState}
              periodFilter={periodFilter}
              isLoading={queryData.isLoading}
              queryError={showNoImsPlaceholder ? undefined : queryData.error}
              noImsPlaceholder={showNoImsPlaceholder}
              entities={metricData?.entities ?? []}
              activeTab={activeTab}
              setActiveTab={v => {
                setActiveTab(v);
                filtersState.resetFilters();
              }}
            />
          </LazySection>
        ) : (
          <LazySection>
            <LeaderBoard
              periodFilter={periodFilter}
              isLoading={queryData.isLoading}
              queryError={showNoImsPlaceholder ? undefined : queryData.error}
              noImsPlaceholder={showNoImsPlaceholder}
              entities={metricData?.entities ?? []}
            />
          </LazySection>
        )}
        <LazySection>
          <IMSMetrics
            metricData={metricData?.metrics}
            isLoading={queryData.isLoading}
            queryError={showNoImsPlaceholder ? undefined : queryData.error}
            noImsPlaceholder={showNoImsPlaceholder}
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
