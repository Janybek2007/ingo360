import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { useSession } from '#/shared/session';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { DynamicSales } from '#/widgets/customer/dynamic-sales';
import { IMSTopMetrics } from '#/widgets/ims-top-metrics';

const HomePage: React.FC = () => {
  const { userAccess } = useSession();
  return (
    <main className="space-y-6">
      {userAccess?.can_primary_sales && (
        <LazySection>
          <DynamicPrimarySales />
        </LazySection>
      )}
      {userAccess?.can_market_analysis && (
        <LazySection>
          <IMSTopMetrics />
        </LazySection>
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
