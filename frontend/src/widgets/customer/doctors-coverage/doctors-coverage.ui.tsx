import React from 'react';

import { DoctorsCountVisits } from './ui/count-visits.ui';
import { DoctorsPercentageVisits } from './ui/doctors-percentage-visits.ui';

export const DoctorsCoverage: React.FC = React.memo(() => {
  return (
    <section>
      <div className="flex items-start gap-6 w-full">
        <DoctorsCountVisits />
        <DoctorsPercentageVisits />
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
