import React from 'react';
import { Pie, PieChart, Sector, Tooltip } from 'recharts';

import { DbQueries } from '#/entities/db';
import { LucideArrowIcon } from '#/shared/assets/icons';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getFilterItems } from '#/shared/utils/get-used-items';

import type {
  DoctorCountVisitsProps as DoctorCountVisitsProperties,
  DoctorsCoverageRow,
} from '../doctors-covarage.types';
import { SPECIALITY_COLORS } from '../speciality-colors';

export const DoctorsCountVisits: React.FC<DoctorCountVisitsProperties> =
  React.memo(
    ({
      medicalFacilityItems,
      enabled = true,
      specialityItems,
      changeFilters,
      filters,
    }) => {
      const countQuery = useKeepQuery(
        DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
          ['visits/reports/doctors-by-specialty'],
          {
            medical_facility_ids:
              filters.medical_facility_ids.length ===
              medicalFacilityItems.length
                ? undefined
                : filters.medical_facility_ids,
            speciality_ids:
              filters.speciality_ids.length === specialityItems.length
                ? undefined
                : filters.speciality_ids,

            enabled,
            method: 'POST',
          }
        )
      );

      const visits = React.useMemo(
        () =>
          (countQuery.data ? countQuery.data[0] : []).map(v => ({
            ...v,
            color: SPECIALITY_COLORS[v.speciality_name] ?? null,
          })),
        [countQuery.data]
      );

      const sectionStyle = useSectionStyle();

      return (
        <div className="w-1/2 rounded-2xl bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-inter text-xl leading-[120%] font-medium text-black">
              Количество врачей
            </h4>
            <div className="flex items-center gap-4">
              <Select<true, number | string>
                value={filters.speciality_ids}
                setValue={value =>
                  changeFilters('speciality_ids', value.map(Number))
                }
                isMultiple
                checkbox
                search
                defaultAllSelected
                showToggleAll
                items={specialityItems}
                triggerText="Спепиальности"
                rightIcon={
                  <LucideArrowIcon type="chevron-down" className="size-4.5" />
                }
                classNames={{
                  trigger: 'gap-2 rounded-full justify-between',
                  menu: 'w-[25rem] left-0 max-h-[400px]',
                }}
              />
              <Select<true, number | string>
                value={filters.medical_facility_ids}
                setValue={value =>
                  changeFilters('medical_facility_ids', value.map(Number))
                }
                isMultiple
                checkbox
                search
                defaultAllSelected
                showToggleAll
                items={medicalFacilityItems}
                triggerText="ЛПУ"
                rightIcon={
                  <LucideArrowIcon type="chevron-down" className="size-4.5" />
                }
                classNames={{
                  trigger: 'gap-2 rounded-full justify-between',
                  menu: 'w-[25rem] left-0 max-h-[400px]',
                }}
              />
            </div>
          </div>
          <div>
            <UsedFilter
              // periodCurrent={periodFilter.periodCurrent}
              usedFilterItems={getFilterItems([
                filters.medical_facility_ids.length > 0 &&
                  filters.medical_facility_ids.length !==
                    medicalFacilityItems.length && {
                    value: filters.medical_facility_ids,
                    getLabelFromValue(value) {
                      return (
                        medicalFacilityItems.find(item => item.value === value)
                          ?.label ?? '-'
                      );
                    },
                    onDelete: () =>
                      changeFilters(
                        'medical_facility_ids',
                        medicalFacilityItems.map(item => item.value).map(Number)
                      ),
                    main: {
                      onDelete: v => {
                        changeFilters('medical_facility_ids', p =>
                          p.filter(id => id !== Number(v))
                        );
                      },
                      label: 'ЛПУ:',
                    },
                  },
                filters.speciality_ids.length > 0 &&
                  filters.speciality_ids.length !== specialityItems.length && {
                    value: filters.speciality_ids,
                    getLabelFromValue(value) {
                      return (
                        specialityItems.find(item => item.value === value)
                          ?.label ?? '-'
                      );
                    },
                    onDelete: () =>
                      changeFilters(
                        'speciality_ids',
                        specialityItems.map(item => item.value).map(Number)
                      ),
                    main: {
                      onDelete: v => {
                        changeFilters('speciality_ids', p =>
                          p.filter(id => id !== Number(v))
                        );
                      },
                      label: 'Спепиальности:',
                    },
                  },
              ])}
              resetFilters={() => {
                changeFilters('medical_facility_ids', []);
                changeFilters('speciality_ids', []);
              }}
            />
          </div>

          <AsyncBoundary
            isLoading={countQuery.isLoading}
            queryError={countQuery.error}
          >
            <div className="relative my-3 flex max-h-112 min-h-112 w-full items-center justify-center py-2">
              <PieChart width={sectionStyle.width / 2 - 80} height={400}>
                <Pie
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  data={visits}
                  dataKey="total_count"
                  nameKey="speciality_name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  labelLine={false}
                  label
                  paddingAngle={0}
                  shape={(props: any) => (
                    <Sector
                      {...props}
                      fill={props.color ?? 'transparent'}
                      stroke={props.color ?? '#000000'}
                    />
                  )}
                />
                <Tooltip
                  formatter={(value, _, properties) => {
                    const data = properties?.payload as
                      | DoctorsCoverageRow
                      | undefined;
                    if (!data) return value;
                    const color = (data as any).color as string | null;

                    return [
                      <div
                        key="tooltip"
                        className="font-inter flex flex-col gap-1"
                        style={{ color: '#1D170F' }}
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <span
                            style={{
                              backgroundColor: color ?? 'transparent',
                              border: color ? undefined : '1px solid #000',
                              width: '10px',
                              height: '10px',
                              minWidth: '10px',
                              minHeight: '10px',
                              borderRadius: '50%',
                              display: 'inline-block',
                            }}
                          />
                          <span>{data.speciality_name}</span>
                        </div>
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#4B5563',
                          }}
                        >
                          Количество врачей:{' '}
                          {data.total_count.toLocaleString('ru-RU')}
                        </span>
                      </div>,
                    ];
                  }}
                />
              </PieChart>
            </div>

            <div className="mx-auto grid w-max grid-cols-6 gap-3 pb-3">
              {visits.map((d, index) => (
                <div
                  key={`count-legend-${index}`}
                  className="flex items-center gap-2"
                >
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: d.color ?? 'transparent',
                      border: d.color ? undefined : '1px solid #000',
                    }}
                  />
                  <span className="font-inter leading-full text-sm font-medium text-black">
                    {d.speciality_name}
                  </span>
                </div>
              ))}
            </div>
          </AsyncBoundary>
        </div>
      );
    }
  );

DoctorsCountVisits.displayName = '_DoctorsCountVisits_';
