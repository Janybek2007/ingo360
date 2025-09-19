import React from 'react';

import { PageSection } from '#/shared/components/page-section';
import { DistributorShareDynamics } from '#/widgets/customer/distributor-share-dynamics';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';

const PrimarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <PageSection isGroupped>
        <DynamicPrimarySales as="mixed" />
      </PageSection>
      <PageSection isGroupped>
        <DistributorShareDynamics />
      </PageSection>
    </main>
  );
};

export default PrimarySalesPage;
