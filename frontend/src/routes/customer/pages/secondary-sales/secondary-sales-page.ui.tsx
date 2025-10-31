import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { DistributorDynamics } from '#/widgets/customer/distributor-dynamics';
import { DynamicSecondarySales } from '#/widgets/customer/dynamic-secondary-sales';
import { SecondarySales } from '#/widgets/customer/secondary-sales';

const SecondarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <LazySection>
        <DynamicSecondarySales />
      </LazySection>
      <LazySection>
        <SecondarySales />
      </LazySection>
      <LazySection>
        <DistributorDynamics />
      </LazySection>
    </main>
  );
};

export default SecondarySalesPage;
