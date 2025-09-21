import React from 'react';

import { DistributorDynamics } from '#/widgets/customer/distributor-dynamics';
import { DistributorSales } from '#/widgets/customer/distributor-sales';
import { DynamicSecondarySales } from '#/widgets/customer/dynamic-secondary-sales';
import { SecondarySales } from '#/widgets/customer/secondary-sales';

const SecondarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <SecondarySales />
      <DynamicSecondarySales />
      <DistributorDynamics />
      <DistributorSales />
    </main>
  );
};

export default SecondarySalesPage;
