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
          { label: 'По третичным проаджам', value: 'analysis-tertiary' },
          { label: 'Анализ охват специалистов', value: 'analysis-specialists' },
        ]}
      >
        {({ current }) => (
          <div className="space-y-6">
            {current === 'analysis-visits' && (
              <>
                <TotalVisitsPeriod />
                <OverallVisits />
              </>
            )}
            {current === 'analysis-tertiary' && (
              <>
                <TertiaryVisits />
                <TertiarySalesUnits />
              </>
            )}
            {current === 'analysis-specialists' && (
              <>
                <SpecialistCoverage />
                <DoctorsCoverage />
              </>
            )}
          </div>
        )}
      </Tabs>
    </main>
  );
};

export default VisitActivityPage;
