import React from 'react';
import useLocalStorageState from 'use-local-storage-state';

import { LazySection } from '#/shared/components/lazy-section';
import { Tabs } from '#/shared/components/ui/tabs';
import { DoctorsCoverage } from '#/widgets/customer/doctors-coverage';
import { OverallVisits } from '#/widgets/customer/overall-visits';
import { SpecialistCoverage } from '#/widgets/customer/specialist-coverage';
import { TertiarySalesUnits } from '#/widgets/customer/tertiary-sales-units';
import { TertiaryVisits } from '#/widgets/customer/tertiary-visits';
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
          <div className="space-y-6 w-full">
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
                  <TertiaryVisits />
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
