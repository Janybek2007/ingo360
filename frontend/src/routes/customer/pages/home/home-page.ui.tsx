import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { useSession } from '#/shared/session';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { DynamicSales } from '#/widgets/customer/dynamic-sales';
import { KPICards } from '#/widgets/customer/kpi-cards';
import { LeaderBoard } from '#/widgets/customer/leader-board';

const HomePage: React.FC = () => {
  const { userAccess } = useSession();
  return (
    <main className="p-5 space-y-6">
      {userAccess?.can_primary_sales && (
        <LazySection>
          <DynamicPrimarySales />
        </LazySection>
      )}
      {userAccess?.can_market_analysis && (
        <>
          <LazySection>
            <LeaderBoard />
          </LazySection>
          <LazySection>
            <KPICards />
          </LazySection>
        </>
      )}
      {userAccess?.can_primary_sales && userAccess.can_secondary_sales && (
        <LazySection>
          <DynamicSales />
        </LazySection>
      )}
    </main>
  );
};

export default HomePage;
