import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { stringToColor } from '#/shared/utils/string-to-color';

import type { DoctorsCoverageRow } from '../doctors-coverage.ui';

export const DoctorsCountVisits: React.FC<{
  visits: DoctorsCoverageRow[];
  filters: React.ReactNode;
}> = React.memo(({ visits, filters }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
          Количество врачей
        </h4>
        {filters}
      </div>

      <div className="relative min-h-[24rem] max-h-[24rem] py-2 w-full flex items-center justify-center my-3">
        <PieChart width={360} height={360}>
          <Pie
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data={visits}
            dataKey="count_with_visits"
            nameKey="speciality_name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            labelLine={false}
            label={entry => String(entry.count_with_visits)}
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
    </>
  );
});

DoctorsCountVisits.displayName = '_DoctorsCountVisits_';
