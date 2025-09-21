import React from 'react';

import { KPICards } from '#/widgets/customer/kpi-cards';
import { MarketEntityProfile } from '#/widgets/customer/market-entity-profile';
import { MarketInsights } from '#/widgets/customer/market-insights';

const MarketDevelopmentPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <MarketInsights />
      <MarketEntityProfile />
      <KPICards />
    </main>
  );
};

export default MarketDevelopmentPage;
