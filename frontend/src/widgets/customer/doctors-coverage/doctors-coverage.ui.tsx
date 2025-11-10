import React from 'react';

import { DoctorsCountVisits } from './ui/count-visits.ui';
import { DoctorsPercentageVisits } from './ui/doctors-percentage-visits.ui';

export interface DoctorsCoverageRow {
  speciality_id: 8;
  speciality_name: 'Проктолог';
  total_count: 173;
  count_with_visits: 91;
  coverage_percentage: 52.60115606936416;
}

export interface FiltersConfig {
  months: number[];
  years: number[];
  medical_facility_ids: number[];
}

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
