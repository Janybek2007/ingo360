import React from 'react';

import { Tabs } from '#/shared/components/ui/tabs';
import { NumericalDistribution } from '#/widgets/customer/numerical-distribution';
import { PharmacyBalance } from '#/widgets/customer/pharmacy-balance';
import { RetailSales } from '#/widgets/customer/retail-sales';

const TertiarySalesPage: React.FC = () => {
  return (
    <main className="space-y-6">
      <Tabs
        items={[
          { value: 'retail', label: 'Розничные продажи' },
          { value: 'numerical', label: 'Численное распределение' },
          { value: 'white-spots', label: 'Анализ аптек' },
        ]}
        defaultValue="retail"
      >
        {({ current }) => (
          <>
            {current === 'retail' && <RetailSales />}
            {current === 'numerical' && <NumericalDistribution />}
            {current === 'white-spots' && <PharmacyBalance />}
          </>
        )}
      </Tabs>
    </main>
  );
};

export default TertiarySalesPage;
