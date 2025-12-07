import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { stringToColor } from '#/shared/utils/string-to-color';

import type {
  DoctorCountVisitsProps,
  DoctorsCoverageRow,
} from '../doctors-covarage.types';

export const DoctorsCountVisits: React.FC<DoctorCountVisitsProps> = React.memo(
  ({ medicalFacilityIds, children, usedFilter }) => {
    const countQuery = useKeepQuery(
      DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
        ['visits/reports/doctors-by-specialty'],
        { medical_facility_ids: medicalFacilityIds }
      )
    );

    const visits = React.useMemo(
      () => (countQuery.data ? countQuery.data[0] : []),
      [countQuery.data]
    );

    return (
      <div className="w-1/2 rounded-2xl p-5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
            Количество врачей
          </h4>
          {children}
        </div>
        <div>{usedFilter}</div>

        <AsyncBoundary
          isLoading={countQuery.isLoading}
          queryError={countQuery.error}
        >
          <div className="relative min-h-[24rem] max-h-[24rem] py-2 w-full flex items-center justify-center my-3">
            <PieChart width={360} height={360}>
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
              >
                {visits.map((_, i) => (
                  <Cell
                    key={`cell-count-${i}`}
                    fill={stringToColor(_.speciality_name)}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _, props) => {
                  const data = props?.payload as DoctorsCoverageRow | undefined;
                  if (!data) return value;
                  const color = stringToColor(data.speciality_name);

                  return [
                    <div
                      key="tooltip"
                      className="flex flex-col gap-1 font-inter"
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

          <div className="mx-auto grid grid-cols-6 gap-3 w-max pb-3">
            {visits.map((d, i) => (
              <div
                key={`count-legend-${i}`}
                className="flex items-center gap-2"
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: stringToColor(d.speciality_name),
                  }}
                />
                <span className="font-inter font-medium text-sm leading-[100%] text-black">
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
