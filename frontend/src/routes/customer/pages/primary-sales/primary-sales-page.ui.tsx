import React from 'react';

import { LazySection } from '#/shared/components/lazy-section';
import { DistributorShare } from '#/widgets/customer/distributor-share';
import { DistributorShareDynamics } from '#/widgets/customer/distributor-share-dynamics';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { Inventory } from '#/widgets/customer/inventory';
import { Shipments } from '#/widgets/customer/shipments';
import { Stocks } from '#/widgets/customer/stocks';

const PrimarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <LazySection>
        <DynamicPrimarySales as="mixed" />
      </LazySection>
      <LazySection>
        <DistributorShareDynamics />
      </LazySection>
      <LazySection>
        <Shipments />
      </LazySection>
      <LazySection>
        <Stocks />
      </LazySection>
      <LazySection>
        <Inventory />
      </LazySection>
      <LazySection>
        <DistributorShare />
      </LazySection>
    </main>
  );
};

export default PrimarySalesPage;
