import React from 'react';

import { DistributorShare } from '#/widgets/customer/distributor-share';
import { DistributorShareDynamics } from '#/widgets/customer/distributor-share-dynamics';
import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { Inventory } from '#/widgets/customer/inventory';
import { Shipments } from '#/widgets/customer/shipments';
import { Stocks } from '#/widgets/customer/stocks';

const PrimarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <DynamicPrimarySales as="mixed" />
      <DistributorShareDynamics />
      <Shipments />
      <Stocks />
      <Inventory />
      <DistributorShare />
    </main>
  );
};

export default PrimarySalesPage;
