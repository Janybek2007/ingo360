import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { PageSection } from '#/shared/components/page-section';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { IMSMetrics } from '#/widgets/customer/ims-metrics';
import { MarketEntityProfile } from '#/widgets/customer/market-entity-profile';
import { MarketInsights } from '#/widgets/customer/market-insights';

const MarketDevelopmentPage: React.FC = () => {
  const periodFilter = usePeriodFilter(['mat', 'ytd', 'year', 'month'], 'mat');

  return (
    <main className="space-y-6">
      <LazySection>
        <MarketEntityProfile periodFilter={periodFilter} />
      </LazySection>
      <LazySection>
        <PageSection>
          <IMSMetrics
            periodFilter={{
              period: periodFilter.period,
              selectedValues: periodFilter.selectedValues,
            }}
          />
        </PageSection>
      </LazySection>
      <LazySection>
        <MarketInsights />
      </LazySection>
    </main>
  );
};

export default MarketDevelopmentPage;
