import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';

import { DoctorsCountVisits } from './ui/count-visits.ui';
import { DoctorsPercentageVisits } from './ui/percentage-visits.ui';

export const DoctorsCoverage: React.FC = React.memo(() => {
  const filterOptions = useFilterOptions(
    [
      'clients/medical-facilities',
      'clients/specialities',
      'products/product-groups',
    ],
    'visits'
  );

  const [medicalFacilityIds, setMedicalFacilityIds] = React.useState<number[]>(
    []
  );

  return (
    <section>
      <div className="flex w-full items-start gap-6">
        <DoctorsCountVisits
          enabled={!filterOptions.isLoading}
          medicalFacilityItems={
            filterOptions.options.clients_medical_facilities
          }
          setMedicalFacilityIds={setMedicalFacilityIds}
          medicalFacilityIds={medicalFacilityIds}
          specialityItems={filterOptions.options.clients_specialities}
        ></DoctorsCountVisits>
        <DoctorsPercentageVisits
          groupItems={filterOptions.options.products_product_groups}
          enabled={!filterOptions.isLoading}
          medicalFacilityIds={medicalFacilityIds}
        />
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
