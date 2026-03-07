import React from 'react';
import { Pie, PieChart, Sector, Tooltip } from 'recharts';

import { DbQueries } from '#/entities/db';
import { LucideArrowIcon } from '#/shared/assets/icons';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { stringToColor } from '#/shared/utils/string-to-color';

import type {
  DoctorCountVisitsProps as DoctorCountVisitsProperties,
  DoctorsCoverageRow,
} from '../doctors-covarage.types';

export const DoctorsCountVisits: React.FC<DoctorCountVisitsProperties> =
  React.memo(
    ({
      medicalFacilityIds,
      medicalFacilityItems,
      setMedicalFacilityIds,
      enabled = true,
    }) => {
      const countQuery = useKeepQuery(
        DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
          ['visits/reports/doctors-by-specialty'],
          {
            medical_facility_ids: medicalFacilityIds,

            enabled,
            method: 'POST',
          }
        )
      );

      const visits = React.useMemo(
        () => (countQuery.data ? countQuery.data[0] : []),
        [countQuery.data]
      );
      const sectionStyle = useSectionStyle();

      return (
        <div className="w-1/2 rounded-2xl bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-inter text-xl leading-[120%] font-medium text-black">
              Количество врачей
            </h4>
            <Select<true, number | string>
              value={medicalFacilityIds}
              setValue={value => setMedicalFacilityIds(value.map(Number))}
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
                trigger: 'gap-4 rounded-full justify-between',
                menu: 'w-[25rem] left-0 max-h-[400px]',
              }}
            />
          </div>
          <div>
            <UsedFilter
              usedFilterItems={getUsedFilterItems([
                medicalFacilityIds.length > 0 && {
                  value: medicalFacilityIds,
                  getLabelFromValue(value) {
                    return (
                      medicalFacilityItems.find(item => item.value === value)
                        ?.label ?? '-'
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
          </div>

          <AsyncBoundary
            isLoading={countQuery.isLoading}
            queryError={countQuery.error}
          >
            <div className="relative my-3 flex max-h-112 min-h-112 w-full items-center justify-center py-2">
              <PieChart width={sectionStyle.width / 2 - 80} height={440}>
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
                      fill={stringToColor(props.speciality_name)}
                    />
                  )}
                />
                <Tooltip
                  formatter={(value, _, properties) => {
                    const data = properties?.payload as
                      | DoctorsCoverageRow
                      | undefined;
                    if (!data) return value;
                    const color = stringToColor(data.speciality_name);

                    return [
                      <div
                        key="tooltip"
                        className="font-inter flex flex-col gap-1"
                        style={{ color: '#1D170F' }}
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <span
                            style={{
                              backgroundColor: color,
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
                      backgroundColor: stringToColor(d.speciality_name),
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
