import React from 'react';

import { PageSection } from '#/shared/components/page-section';
import { KPICards } from '#/widgets/customer/kpi-cards';
import { MarketEntityProfile } from '#/widgets/customer/market-entity-profile';
import { MarketInsights } from '#/widgets/customer/market-insights';

const MarketDevelopmentPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <MarketEntityProfile />
      <PageSection>
        <KPICards />
      </PageSection>
      <MarketInsights />
    </main>
  );
};

export default MarketDevelopmentPage;
