import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { LucideArrowIcon } from '#/shared/components/icons';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';
import { stringToColor } from '#/shared/utils/string-to-color';

import type { DoctorsCoverageRow } from '../doctors-coverage.ui';

export const DoctorsPercentageVisits: React.FC<{
  visits: DoctorsCoverageRow[];
}> = React.memo(({ visits }) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
          Доля врачей с визитами (%)
        </h4>
        <Select<true, number>
          triggerText={'Месяц'}
          items={allMonths.map((m, i) => ({ value: i + 1, label: m }))}
          value={[]}
          checkbox
          isMultiple
          showToggleAll
          setValue={() => {}}
          rightIcon={
            <LucideArrowIcon type="chevron-down" className="size-[1.125rem]" />
          }
          classNames={{
            trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
            menu: 'w-[14rem] w-max right-0',
          }}
        />
      </div>

      <div className="relative min-h-[21.875rem] max-h-[21.875rem] w-full flex items-center justify-center my-3">
        <PieChart width={380} height={380}>
          <Pie
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data={visits}
            dataKey="coverage_percentage"
            nameKey="speciality_name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            labelLine={false}
            label={entry =>
              `${(entry.coverage_percentage as number)?.toFixed(1)}%`
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
