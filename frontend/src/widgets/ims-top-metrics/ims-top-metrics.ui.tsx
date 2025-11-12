import React from 'react';

import { DbQueries } from '#/entities/db';
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
    const periodFilter = usePeriodFilter(
      ['mat', 'ytd', 'year', 'month'],
      'mat'
    );

    const queryData = useKeepQuery(
      DbQueries.GetDbItemsQuery<TopMetricsRow>(['ims/reports/top'], {
        periods: periodFilter.selectedValues,
        type_period: periodFilter.period,
        group_column: isMarketDevelopmentPage ? activeTab : 'company',
      })
    );

    const metricData = React.useMemo(() => {
      return queryData.data ? queryData.data[0] : null;
    }, [queryData.data]);

    return (
      <>
        {isMarketDevelopmentPage ? (
          <MarketEntityProfile
            periodFilter={periodFilter}
            isLoading={queryData.isLoading}
            queryError={queryData.error}
            entities={metricData?.entities ?? []}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
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
