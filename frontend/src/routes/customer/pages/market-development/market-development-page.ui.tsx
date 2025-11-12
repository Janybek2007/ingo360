import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { MarketInsights } from '#/widgets/customer/market-insights';
import { IMSTopMetrics } from '#/widgets/ims-top-metrics';

const MarketDevelopmentPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <LazySection>
        <IMSTopMetrics isMarketDevelopmentPage />
      </LazySection>
      <LazySection>
        <MarketInsights />
      </LazySection>
    </main>
  );
};

export default MarketDevelopmentPage;
