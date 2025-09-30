import React from 'react';

import { DistributorDynamics } from '#/widgets/customer/distributor-dynamics';
import { DynamicSecondarySales } from '#/widgets/customer/dynamic-secondary-sales';
import { SecondarySales } from '#/widgets/customer/secondary-sales';

const SecondarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <SecondarySales />
      <DynamicSecondarySales />
      <DistributorDynamics />
    </main>
  );
};

export default SecondarySalesPage;
