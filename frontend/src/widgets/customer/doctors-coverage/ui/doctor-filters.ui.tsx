import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';
import { LucideArrowIcon } from '#/shared/components/icons';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';

import type { FiltersConfig } from '../doctors-coverage.ui';

interface DoctorFiltersProps {
  filters: FiltersConfig;
  setFilters: React.Dispatch<React.SetStateAction<FiltersConfig>>;
  showMedicalFacility?: boolean;
  showYears?: boolean;
  showMonths?: boolean;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = React.memo(
  ({
    filters,
    setFilters,
    showMedicalFacility = true,
    showYears = true,
    showMonths = true,
  }) => {
    const filterOptions = useFilterOptions({
      medicalFacilities: showMedicalFacility,
      brands: false,
      groups: false,
    });
    const medicalFacilityItems = showMedicalFacility
      ? filterOptions.medicalFacilities
      : [];

    return (
      <div className="flex items-center gap-4">
        {showMedicalFacility && (
          <Select<true, number>
            value={filters.medical_facility_ids}
            setValue={value =>
              setFilters(prev => ({ ...prev, medical_facility_ids: value }))
            }
            isMultiple
            checkbox
            search
            items={medicalFacilityItems}
            triggerText="ЛПУ"
            rightIcon={
              <LucideArrowIcon
                type="chevron-down"
                className="size-[1.125rem]"
              />
            }
            classNames={{
              trigger: 'gap-4 rounded-full justify-between',
              menu: 'w-[20rem] left-0',
            }}
          />
        )}
        {showYears && (
          <Select<true, number>
            triggerText="Год"
            items={[2020, 2021, 2022, 2023, 2024, 2025].map(year => ({
              value: year,
              label: year.toString(),
            }))}
            value={filters.years}
            checkbox
            isMultiple
            showToggleAll
            setValue={value => setFilters(prev => ({ ...prev, years: value }))}
            rightIcon={
              <LucideArrowIcon
                type="chevron-down"
                className="size-[1.125rem]"
              />
            }
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
              menu: 'w-[14rem] w-max right-0',
            }}
          />
        )}
        {showMonths && (
          <Select<true, number>
            triggerText="Месяц"
            items={allMonths.map((month, index) => ({
              value: index + 1,
              label: month,
            }))}
            value={filters.months}
            checkbox
            isMultiple
            showToggleAll
            setValue={value => setFilters(prev => ({ ...prev, months: value }))}
            rightIcon={
              <LucideArrowIcon
                type="chevron-down"
                className="size-[1.125rem]"
              />
            }
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
              menu: 'w-[14rem] w-max right-0',
            }}
          />
        )}
      </div>
    );
  }
);

DoctorFilters.displayName = '_DoctorFilters_';
