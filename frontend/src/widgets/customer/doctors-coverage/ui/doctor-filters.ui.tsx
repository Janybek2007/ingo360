import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';
import { LucideArrowIcon } from '#/shared/components/icons';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';

export interface FiltersConfig {
  months: number[];
  years: number[];
  medical_facility_ids: number[];
}

interface DoctorFiltersProps {
  filters: Partial<FiltersConfig> | number[];
  setFilters: React.Dispatch<
    React.SetStateAction<Partial<FiltersConfig> | number[]>
  >;
  showConfigs?: Partial<
    Record<'medical_facilities' | 'years' | 'months', boolean>
  >;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = React.memo(
  ({
    filters,
    setFilters,
    showConfigs = {
      medical_facilities: false,
      years: false,
      months: false,
    },
  }) => {
    const filterOptions = useFilterOptions({
      medicalFacilities: showConfigs.medical_facilities,
      brands: false,
      groups: false,
    });
    const medicalFacilityItems = showConfigs.medical_facilities
      ? filterOptions.medicalFacilities
      : [];

    return (
      <div className="flex items-center gap-4">
        {showConfigs.medical_facilities && (
          <Select<true, number>
            value={
              Array.isArray(filters)
                ? filters
                : (filters.medical_facility_ids ?? [])
            }
            setValue={value => setFilters(value)}
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
        {showConfigs.years && !Array.isArray(filters) && filters.years && (
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
        {showConfigs.months && !Array.isArray(filters) && filters.months && (
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
