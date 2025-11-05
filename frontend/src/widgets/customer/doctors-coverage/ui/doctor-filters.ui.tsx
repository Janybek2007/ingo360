import React from 'react';

import { useFilterOptions } from '#/shared/components/db-filters';
import { LucideArrowIcon } from '#/shared/components/icons';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';

import type { FiltersConfig } from '../doctors-coverage.ui';

interface DoctorFiltersProps {
  filters: FiltersConfig;
  setFilters: React.Dispatch<React.SetStateAction<FiltersConfig>>;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = React.memo(
  ({ filters, setFilters }) => {
    const filterOptions = useFilterOptions({
      medicalFacilities: true,
      brands: false,
      groups: false,
    });
    return (
      <div className="flex items-center gap-4">
        <Select<true, number>
          value={filters.medical_facility_ids}
          setValue={v =>
            setFilters(prev => ({ ...prev, medical_facility_ids: v }))
          }
          isMultiple
          checkbox
          search
          items={filterOptions.medicalFacilities}
          triggerText={'ЛПУ'}
          classNames={{
            trigger: 'gap-4 rounded-full justify-between',
            menu: 'w-[20rem] left-0',
          }}
        />
        <Select<true, number>
          triggerText={'Год'}
          items={[2020, 2021, 2022, 2023, 2024, 2025].map(year => ({
            value: year,
            label: year.toString(),
          }))}
          value={filters.years}
          checkbox
          isMultiple
          showToggleAll
          setValue={v => setFilters(prev => ({ ...prev, years: v }))}
          rightIcon={
            <LucideArrowIcon type="chevron-down" className="size-[1.125rem]" />
          }
          classNames={{
            trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
            menu: 'w-[14rem] w-max right-0',
          }}
        />
        <Select<true, number>
          triggerText={'Месяц'}
          items={allMonths.map((m, i) => ({
            value: i + 1,
            label: m,
          }))}
          value={filters.months}
          checkbox
          isMultiple
          showToggleAll
          setValue={v => setFilters(prev => ({ ...prev, months: v }))}
          rightIcon={
            <LucideArrowIcon type="chevron-down" className="size-[1.125rem]" />
          }
          classNames={{
            trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
            menu: 'w-[14rem] w-max right-0',
          }}
        />
      </div>
    );
  }
);

DoctorFilters.displayName = '_DoctorFilters_';
