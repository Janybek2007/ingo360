import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';

import { DoctorsCountVisits } from './ui/count-visits.ui';
import { DoctorsPercentageVisits } from './ui/percentage-visits.ui';

export const DoctorsCoverage: React.FC = React.memo(() => {
  const filterOptions = useFilterOptions({
    medicalFacilities: true,
    brands: false,
    groups: false,
  });
  const [medicalFacilityIds, setMedicalFacilityIds] = React.useState<number[]>(
    []
  );

  return (
    <section>
      <div className="flex items-start gap-6 w-full">
        <DoctorsCountVisits
          enabled={!filterOptions.isLoading}
          setMedicalFacilityIds={setMedicalFacilityIds}
          medicalFacilityItems={filterOptions.medicalFacilities}
          medicalFacilityIds={medicalFacilityIds}
        ></DoctorsCountVisits>
        <DoctorsPercentageVisits
          enabled={!filterOptions.isLoading}
          medicalFacilityIds={medicalFacilityIds}
        />
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
