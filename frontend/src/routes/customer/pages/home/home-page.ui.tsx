import React from 'react';

import { SalesTable } from '#/shared/components/ui/salesTable';
import { DynamicPartialSales } from '#/widgets/customer/dynamic-partial-sales';
import { DynamicSales } from '#/widgets/customer/dynamic-sales';

const HomePage: React.FC = () => {
  return (
    <main className="p-5 space-y-6">
      <DynamicPartialSales />
      <SalesTable />
      <DynamicSales />
    </main>
  );
};

export default HomePage;
