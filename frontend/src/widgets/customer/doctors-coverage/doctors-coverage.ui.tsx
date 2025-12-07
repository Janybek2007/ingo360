import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';
import { LucideArrowIcon } from '#/shared/components/icons';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

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
          <Select<true, number | string>
            value={medicalFacilityIds}
            setValue={value => setMedicalFacilityIds(value.map(Number))}
            isMultiple
            checkbox
            search
            defaultAllSelected
            showToggleAll
            items={filterOptions.medicalFacilities}
            triggerText="ЛПУ"
            rightIcon={
              <LucideArrowIcon
                type="chevron-down"
                className="size-[1.125rem]"
              />
            }
            classNames={{
              trigger: 'gap-4 rounded-full justify-between',
              menu: 'w-[25rem] left-0 max-h-[400px]',
            }}
          />
        </DoctorsCountVisits>
        <DoctorsPercentageVisits medicalFacilityIds={medicalFacilityIds} />
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
