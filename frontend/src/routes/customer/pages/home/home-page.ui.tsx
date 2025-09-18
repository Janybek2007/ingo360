import React from 'react';

import { DynamicPrimarySales } from '#/widgets/customer/dynamic-primary-sales';
import { DynamicSales } from '#/widgets/customer/dynamic-sales';
import { KPICards } from '#/widgets/customer/kpi-cards';

const HomePage: React.FC = () => {
  return (
    <main className="p-5 space-y-6">
      <DynamicPrimarySales />
      {/* Leaderboard */}
      <KPICards />
      <DynamicSales />
    </main>
  );
};

export default HomePage;
