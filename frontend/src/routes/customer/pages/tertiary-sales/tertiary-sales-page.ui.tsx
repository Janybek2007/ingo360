import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { Tabs } from '#/shared/components/ui/tabs';
import { NumericalDistribution } from '#/widgets/customer/numerical-distribution';
import { PharmacyBalance } from '#/widgets/customer/pharmacy-balance';
import { RetailSales } from '#/widgets/customer/retail-sales';

const TertiarySalesPage: React.FC = () => {
  const [current, setCurrent] = useLocalStorageState('tertiary-activity-tab', {
    defaultValue: 'retail',
  });
  return (
    <main className="space-y-6">
      <Tabs
        items={[
          { value: 'retail', label: 'Третичные продажи' },
          { value: 'pharmacy-balance', label: 'Остаток по аптекам' },
          { value: 'numerical', label: 'Нумерическая диструбуция' },
        ]}
        defaultValue={current}
        saveCurrent={setCurrent}
      >
        {({ current }) => (
          <>
            {current === 'retail' && <RetailSales />}
            {current === 'numerical' && <NumericalDistribution />}
            {current === 'pharmacy-balance' && <PharmacyBalance />}
          </>
        )}
      </Tabs>
    </main>
  );
};

export default TertiarySalesPage;
