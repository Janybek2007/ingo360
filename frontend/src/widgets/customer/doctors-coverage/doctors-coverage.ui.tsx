import React from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';

const data: { name: string; value: number; fill: string }[] = [
  { name: 'Лор', value: 250, fill: '#1C0072' },
  { name: 'Уролог', value: 125, fill: '#BC9BF7' },
  { name: 'ЛПУ', value: 75, fill: '#FED562' },
  { name: 'Кардио', value: 50, fill: '#F35656' },
];

export const DoctorsCoverage: React.FC = React.memo(() => {
  return (
    <section>
      <div className="flex items-start gap-6 w-full">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="w-1/2 rounded-2xl p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-inter font-medium text-xl leading-[120%] text-black">
                {idx === 0
                  ? 'Количество врачей'
                  : 'Количество врачей с визитами'}
              </h4>
              <Select<true, string>
                triggerText={'Месяц'}
                items={allMonths.map(m => ({ label: String(m), value: m }))}
                value={allMonths as unknown as string[]}
                checkbox
                isMultiple
                setValue={() => {}}
                rightIcon={
                  <Icon
                    name="lucide:chevron-down"
                    className="size-[1.125rem]"
                  />
                }
                classNames={{
                  trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
                  menu: 'w-[8.75rem] right-0',
                }}
              />
            </div>
            <div className="relative min-h-[21.875rem] max-h-[21.875rem] w-full flex items-center justify-center my-3">
              <PieChart width={300} height={300}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={0}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  labelLine={false}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="mx-auto flex items-center gap-3 w-max pb-3">
              {data.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: d.fill }}
                  ></span>
                  <span className="font-inter font-medium text-sm leading-full text-black">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

DoctorsCoverage.displayName = '_DoctorsCoverage_';
