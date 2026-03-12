import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';

import type {
  ChangeDoctorsCoverageFilters,
  DoctorsCoverageFilters,
} from './doctors-covarage.types';
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

  const [filters, setFilters] = React.useState<DoctorsCoverageFilters>({
    medical_facility_ids: [],
    speciality_ids: [],
  });

  const changeFilters: ChangeDoctorsCoverageFilters = React.useCallback(
    (key, value) => {
      setFilters(prev => ({
        ...prev,
        [key]: typeof value === 'function' ? value(prev[key]) : value,
      }));
    },
    []
  );

  return (
    <section>
      <div className="flex w-full items-start gap-6">
        <DoctorsCountVisits
          enabled={!filterOptions.isLoading}
          filters={filters}
          changeFilters={changeFilters}
          medicalFacilityItems={
            filterOptions.options.clients_medical_facilities
          }
          specialityItems={filterOptions.options.clients_specialities}
        ></DoctorsCountVisits>
        <DoctorsPercentageVisits
          groupItems={filterOptions.options.products_product_groups}
          enabled={!filterOptions.isLoading}
          filters={filters}
        />
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
