import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { DynamicSales } from '#/widgets/customer/dynamic-sales';
import { KPICards } from '#/widgets/customer/kpi-cards';
import { LeaderBoard } from '#/widgets/customer/leader-board';

const HomePage: React.FC = () => {
  return (
    <main className="p-5 space-y-6">
      <LazySection>
        <DynamicPrimarySales />
      </LazySection>
      <LazySection>
        <LeaderBoard />
      </LazySection>
      <LazySection>
        <KPICards />
      </LazySection>
      <LazySection>
        <DynamicSales />
      </LazySection>
    </main>
  );
};

export default HomePage;
