import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { PageSection } from '#/shared/components/page-section';
import { KPICards } from '#/widgets/customer/kpi-cards';
import { MarketEntityProfile } from '#/widgets/customer/market-entity-profile';
import { MarketInsights } from '#/widgets/customer/market-insights';

const MarketDevelopmentPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <LazySection>
        <MarketEntityProfile />
      </LazySection>
      <LazySection>
        <PageSection>
          <KPICards />
        </PageSection>
      </LazySection>
      <LazySection>
        <MarketInsights />
      </LazySection>
    </main>
  );
};

export default MarketDevelopmentPage;
