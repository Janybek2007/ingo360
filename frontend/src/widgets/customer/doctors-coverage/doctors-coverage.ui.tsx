import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

import { DoctorsCountVisits } from './ui/count-visits.ui';
import { DoctorFilters } from './ui/doctor-filters.ui';
import { DoctorsPercentageVisits } from './ui/doctors-percentage-visits.ui';

export const DoctorsCoverage: React.FC = React.memo(() => {
  const [medicalFacilityIds, setMedicalFacilityIds] = React.useState<number[]>(
    []
  );

  const filterOptions = useFilterOptions({
    medicalFacilities: true,
    brands: false,
    groups: false,
  });

  return (
    <section>
      <div className="flex items-start gap-6 w-full">
        <DoctorsCountVisits
          medicalFacilityIds={medicalFacilityIds}
          usedFilter={
            <UsedFilter
              usedFilterItems={getUsedFilterItems([
                medicalFacilityIds.length > 0 && {
                  value: medicalFacilityIds,
                  getLabelFromValue(value) {
                    return (
                      filterOptions.medicalFacilities.find(
                        item => item.value === value
                      )?.label ?? '-'
                    );
                  },
                  main: {
                    onDelete: v => {
                      setMedicalFacilityIds(p =>
                        p.filter(id => id !== Number(v))
                      );
                    },
                    label: 'ЛПУ:',
                  },
                },
              ])}
              resetFilters={() => setMedicalFacilityIds([])}
            />
          }
        >
          <DoctorFilters
            filters={medicalFacilityIds}
            setFilters={ids => setMedicalFacilityIds(ids as number[])}
            showConfigs={{ medical_facilities: true }}
            medicalFacilityItems={filterOptions.medicalFacilities}
          />
        </DoctorsCountVisits>
        <DoctorsPercentageVisits medicalFacilityIds={medicalFacilityIds} />
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
