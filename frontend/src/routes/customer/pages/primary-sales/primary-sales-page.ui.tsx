import React from 'react';

import { PageSection } from '#/shared/components/page-section';
import { DistributorShare } from '#/widgets/customer/distributor-share';
import { DistributorShareDynamics } from '#/widgets/customer/distributor-share-dynamics';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { Inventory } from '#/widgets/customer/inventory';
import { Shipments } from '#/widgets/customer/shipments';
import { Stocks } from '#/widgets/customer/stocks';

const PrimarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <PageSection isGroupped>
        <Shipments />
        <Stocks />
        <Inventory />
        <DynamicPrimarySales as="mixed" />
      </PageSection>
      <PageSection isGroupped>
        <DistributorShare />
        <DistributorShareDynamics />
      </PageSection>
    </main>
  );
};

export default PrimarySalesPage;
