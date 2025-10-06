import React from 'react';

import { Tabs } from '#/shared/components/ui/tabs';
import { DoctorsCoverage } from '#/widgets/customer/doctors-coverage';
import { OverallVisits } from '#/widgets/customer/overall-visits';
import { SpecialistCoverage } from '#/widgets/customer/specialist-coverage';
import { TertiarySalesUnits } from '#/widgets/customer/tertiary-sales-units';
import { TertiaryVisits } from '#/widgets/customer/tertiary-visits';
import { TotalVisitsPeriod } from '#/widgets/customer/total-visits-period';

const VisitActivityPage: React.FC = () => {
  return (
    <main>
      <Tabs
        items={[
          { label: 'Анализ визитной активности', value: 'analysis-visits' },
          { label: 'Третичным продажи', value: 'tertiary-sales' },
          { label: 'Анализ охват специалистов', value: 'analysis-specialists' },
        ]}
      >
        {({ current }) => (
          <div className="space-y-6">
            {current === 'analysis-visits' && (
              <>
                <OverallVisits />
                <TotalVisitsPeriod />
              </>
            )}
            {current === 'tertiary-sales' && (
              <>
                <TertiarySalesUnits />
                <TertiaryVisits />
              </>
            )}
            {current === 'analysis-specialists' && (
              <>
                <DoctorsCoverage />
                <SpecialistCoverage />
              </>
            )}
          </div>
        )}
      </Tabs>
    </main>
  );
};

export default VisitActivityPage;
