import React from 'react';
import { Cell, Pie, PieChart, Tooltip, type TooltipProps } from 'recharts';

import { stringToColor } from '#/shared/utils/string-to-color';

import type { DoctorsCoverageRow } from '../doctors-coverage.ui';

export const DoctorsPercentageVisits: React.FC<{
  visits: DoctorsCoverageRow[];
  filters?: React.ReactNode;
}> = React.memo(({ visits, filters }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
          Доля врачей с визитами (%)
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
            label={entry =>
              `${(entry.count_with_visits as number)?.toFixed(1)} (${(entry.coverage_percentage as number)?.toFixed(1)}%)`
            }
            paddingAngle={0}
          >
            {visits.map((item, i) => (
              <Cell
                key={`cell-perc-${i}`}
                fill={stringToColor(item.speciality_name)}
              />
            ))}
          </Pie>
          <Tooltip content={<PercentageTooltip />} />
        </PieChart>
      </div>

      <div className="mx-auto grid grid-cols-6 gap-3 w-max pb-3">
        {visits.map((d, i) => (
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
    </>
  );
});
DoctorsPercentageVisits.displayName = '_DoctorsPercentageVisits_';

const PercentageTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload as DoctorsCoverageRow | undefined;
  if (!data) return null;

  const color =
    payload[0]?.color ||
    (data ? stringToColor(data.speciality_name) : undefined) ||
    '#1D170F';

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-sm">
      <div className="flex items-center gap-2 font-medium text-[#1D170F]">
        <span
          className="inline-block rounded-full"
          style={{
            backgroundColor: color,
            width: '10px',
            height: '10px',
            minWidth: '10px',
            minHeight: '10px',
          }}
        />
        <span>{data.speciality_name}</span>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        С визитами: {data.count_with_visits.toLocaleString('ru-RU')}
      </p>
      <p className="text-xs text-gray-600">
        Охват: {data.coverage_percentage.toFixed(1)}%
      </p>
    </div>
  );
};
