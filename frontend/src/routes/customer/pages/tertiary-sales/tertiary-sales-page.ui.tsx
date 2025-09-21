import React from 'react';

import { NumericalDistribution } from '#/widgets/customer/numerical-distribution';
import { RetailSales } from '#/widgets/customer/retail-sales';
import { WhiteSpots } from '#/widgets/customer/white-spots';

const TertiarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <RetailSales />
      <NumericalDistribution />
      <WhiteSpots />
    </main>
  );
};

export default TertiarySalesPage;
