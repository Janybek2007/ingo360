import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { LazySection } from '#/shared/components/lazy-section';
import { Tabs } from '#/shared/components/ui/tabs';
import { DoctorsCoverage } from '#/widgets/customer/doctors-coverage';
import { OverallVisits } from '#/widgets/customer/overall-visits';
import { RetailSales } from '#/widgets/customer/retail-sales';
import { SpecialistCoverage } from '#/widgets/customer/specialist-coverage';
import { TertiarySalesUnits } from '#/widgets/customer/tertiary-sales-units';
import { TotalVisitsPeriod } from '#/widgets/customer/total-visits-period';

const VisitActivityPage: React.FC = () => {
  const [current, setCurrent] = useLocalStorageState('visit-activity-tab', {
    defaultValue: 'analysis_visits',
  });

  return (
    <main>
      <Tabs
        items={[
          { label: 'Анализ визитной активности', value: 'analysis_visits' },
          { label: 'Третичные продажи', value: 'tertiary_sales' },
          { label: 'Анализ охват специалистов', value: 'analysis_specialists' },
        ]}
        defaultValue={current}
        saveCurrent={setCurrent}
        classNames={{ content: 'w-full' }}
      >
        {({ current }) => (
          <div className="w-full space-y-6">
            {current === 'analysis_visits' && (
              <>
                <LazySection>
                  <OverallVisits />
                </LazySection>
                <LazySection>
                  <TotalVisitsPeriod />
                </LazySection>
              </>
            )}
            {current === 'tertiary_sales' && (
              <>
                <LazySection>
                  <TertiarySalesUnits />
                </LazySection>
                <LazySection>
                  <RetailSales />
                </LazySection>
              </>
            )}
            {current === 'analysis_specialists' && (
              <>
                <LazySection>
                  <DoctorsCoverage />
                </LazySection>
                <LazySection>
                  <SpecialistCoverage />
                </LazySection>
              </>
            )}
          </div>
        )}
      </Tabs>
    </main>
  );
};

export default VisitActivityPage;
