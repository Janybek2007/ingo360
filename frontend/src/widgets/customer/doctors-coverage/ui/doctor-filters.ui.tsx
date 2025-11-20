import React from 'react';

import { LucideArrowIcon } from '#/shared/components/icons';
import { type ISelectItem, Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';

import type { DoctorFiltersProps } from '../doctors-covarage.types';

export const DoctorFilters: React.FC<DoctorFiltersProps> = React.memo(
  ({
    filters,
    setFilters,
    showConfigs = {
      medical_facilities: false,
      years: false,
      months: false,
    },
    medicalFacilityItems,
  }) => {
    return (
      <div className="flex items-center gap-4">
        {showConfigs.medical_facilities && (
          <Select<true, number | string>
            value={
              Array.isArray(filters)
                ? filters
                : (filters.medical_facility_ids ?? [])
            }
            setValue={value => setFilters(value.map(Number))}
            isMultiple
            checkbox
            search
            showToggleAll
            items={medicalFacilityItems as ISelectItem<number | string>[]}
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
        {showConfigs.quarters &&
          !Array.isArray(filters) &&
          filters.quarters && (
            <Select<true, number>
              triggerText="Квартал"
              items={[1, 2, 3, 4].map(quarter => ({
                value: quarter,
                label: `Квартал ${quarter}`,
              }))}
              value={filters.quarters}
              checkbox
              isMultiple
              showToggleAll
              setValue={value =>
                setFilters(prev => ({ ...prev, quarters: value }))
              }
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
