import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { stringToColor } from '#/shared/utils/string-to-color';

interface DoctorsCoverageRow extends TDbItem {
  count: number;
}

export const DoctorsCountVisits: React.FC = React.memo(() => {
  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<DoctorsCoverageRow[]>([
      'visits/reports/doctors-by-specialty',
    ])
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  return (
    <div className="w-1/2 rounded-2xl p-5 bg-white">
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
            Количество врачей
          </h4>
        </div>

        <div className="relative min-h-[21.875rem] max-h-[21.875rem] w-full flex items-center justify-center my-3">
          <PieChart width={380} height={380}>
            <Pie
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data={visits}
              dataKey="count"
              nameKey="speciality_name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              labelLine={false}
              label={entry => String(entry.count)}
              paddingAngle={0}
            >
              {visits.map((_, i) => (
                <Cell
                  key={`cell-count-${i}`}
                  fill={stringToColor(_.speciality_name)}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        <div className="mx-auto grid grid-cols-6 gap-3 w-max pb-3">
          {visits.map((d, i) => (
            <div key={`count-legend-${i}`} className="flex items-center gap-2">
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
});

DoctorsCountVisits.displayName = '_DoctorsCountVisits_';
