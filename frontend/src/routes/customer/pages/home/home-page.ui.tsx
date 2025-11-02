import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSession } from '#/shared/session';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { DynamicSales } from '#/widgets/customer/dynamic-sales';
import { IMSMetrics } from '#/widgets/customer/ims-metrics';
import { LeaderBoard } from '#/widgets/customer/leader-board';

const HomePage: React.FC = () => {
  const periodFilter = usePeriodFilter(['mat', 'ytd', 'year', 'month'], 'mat');

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
            <LeaderBoard periodFilter={periodFilter} />
          </LazySection>
          <LazySection>
            <IMSMetrics
              periodFilter={{
                period: periodFilter.period,
                selectedValues: periodFilter.selectedValues,
              }}
            />
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
