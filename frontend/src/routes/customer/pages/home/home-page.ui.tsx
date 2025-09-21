import React from 'react';

import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { DynamicSales } from '#/widgets/customer/dynamic-sales';
import { KPICards } from '#/widgets/customer/kpi-cards';
import { LeaderBoard } from '#/widgets/customer/leader-board';

const HomePage: React.FC = () => {
  return (
    <main className="p-5 space-y-6">
      <DynamicPrimarySales />
      <LeaderBoard />
      <KPICards />
      <DynamicSales />
    </main>
  );
};

export default HomePage;
