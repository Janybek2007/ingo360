import React from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { stringToColor } from '#/shared/utils/string-to-color';

import type { DoctorsCoverageRow } from '../doctors-coverage.ui';
import { DoctorFilters, type FiltersConfig } from './doctor-filters.ui';

export const DoctorsPercentageVisits: React.FC = React.memo(() => {
  const [filters, setFilters] = React.useState<FiltersConfig>({
    months: [],
    years: [],
    medical_facility_ids: [],
  });
  const percentageQuery = useKeepQuery(
    DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>(
      ['visits/reports/doctors-by-specialty'],
      {
        months: filters.months,
        years: filters.years,
        medical_facility_ids: filters.medical_facility_ids,
      }
    )
  );
  const percentageVisits = React.useMemo(
    () => (percentageQuery.data ? percentageQuery.data[0] : []),
    [percentageQuery.data]
  );
  return (
    <div className="w-1/2 rounded-2xl p-5 bg-white">
      <AsyncBoundary
        isLoading={percentageQuery.isLoading}
        queryError={percentageQuery.error}
        isEmpty={percentageVisits.length === 0}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
            Доля врачей с визитами (%)
          </h4>
          <DoctorFilters
            filters={filters}
            setFilters={value => setFilters(value as FiltersConfig)}
            showConfigs={{
              medical_facilities: false,
              years: true,
              months: true,
            }}
          />
        </div>

        <div className="relative min-h-[24rem] max-h-[24rem] py-2 w-full flex items-center justify-center my-3">
          <PieChart width={500} height={360}>
            <Pie
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data={percentageVisits}
              dataKey="count_with_visits"
              nameKey="speciality_name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              labelLine={false}
              label={entry =>
                `${(entry.count_with_visits as number)?.toFixed(1)} (${(entry.coverage_percentage as number)?.toFixed(1)}%)`
              }
              paddingAngle={0}
            >
              {percentageVisits.map((item, i) => (
                <Cell
                  key={`cell-perc-${i}`}
                  fill={stringToColor(item.speciality_name)}
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
                      С визитами:{' '}
                      {data.count_with_visits.toLocaleString('ru-RU')}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#4B5563',
                      }}
                    >
                      Охват: {data.coverage_percentage.toFixed(1)}%
                    </span>
                  </div>,
                ];
              }}
            />
          </PieChart>
        </div>

        <div className="mx-auto grid grid-cols-6 gap-3 w-max pb-3">
          {percentageVisits.map((d, i) => (
            <div key={`perc-legend-${i}`} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: stringToColor(d.speciality_name) }}
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
});
DoctorsPercentageVisits.displayName = '_DoctorsPercentageVisits_';
