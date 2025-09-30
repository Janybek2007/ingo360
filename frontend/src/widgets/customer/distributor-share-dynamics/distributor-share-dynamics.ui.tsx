import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { PageSection } from '#/shared/components/page-section';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';
import { useSectionStyle } from '#/shared/hooks/use-section-style';

const data = [
  { month: 1, eray: 20, neman: 5, med: 10, bimed: 15, elay: 20 },
  { month: 2, eray: 15, neman: 3, med: 8, bimed: 10, elay: 12 },
  { month: 3, eray: 25, neman: 6, med: 12, bimed: 15, elay: 20 },
  { month: 4, eray: 30, neman: 8, med: 15, bimed: 20, elay: 27 },
  { month: 5, eray: 28, neman: 6, med: 14, bimed: 18, elay: 22 },
  { month: 6, eray: 12, neman: 4, med: 6, bimed: 8, elay: 10 },
  { month: 7, eray: 14, neman: 5, med: 7, bimed: 9, elay: 11 },
  { month: 8, eray: 22, neman: 7, med: 12, bimed: 14, elay: 18 },
  { month: 9, eray: 18, neman: 6, med: 10, bimed: 12, elay: 15 },
  { month: 10, eray: 16, neman: 5, med: 9, bimed: 10, elay: 12 },
  { month: 11, eray: 24, neman: 7, med: 12, bimed: 16, elay: 22 },
  { month: 12, eray: 10, neman: 3, med: 6, bimed: 7, elay: 8 },
];

const legends = [
  { label: 'Эрай', fill: '#1f77b4' },
  { label: 'Неман', fill: '#ff7f0e' },
  { label: 'Медсервис', fill: '#2ca02c' },
  { label: 'Бимед', fill: '#17becf' },
  { label: 'Элэй', fill: '#9467bd' },
];

export const DistributorShareDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  return (
    <PageSection
      legends={legends}
      title="Динамика долей дистров в первичке"
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<true, string>
            value={['brand', 'group']}
            setValue={() => {}}
            checkbox
            items={[
              { value: 'brand', label: 'Бренд' },
              { value: 'group', label: 'Группа' },
            ]}
            triggerText="Бренд/Группа"
          />{' '}
          <Select<true, number>
            triggerText={'Год'}
            items={[2024, 2025].map(y => ({ label: String(y), value: y }))}
            value={[2024]}
            checkbox
            setValue={() => {}}
            rightIcon={<Icon name="lucide:chevron-down" size={18} />}
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
              menu: 'w-full right-0',
            }}
          />
          <Select<true, string>
            triggerText={'Месяц'}
            items={allMonths.map(m => ({ label: String(m), value: m }))}
            value={allMonths as unknown as string[]}
            checkbox
            setValue={() => {}}
            rightIcon={<Icon name="lucide:chevron-down" size={18} />}
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
              menu: 'w-[140px] right-0',
            }}
          />
          <Select<true, number>
            triggerText={'Квартал'}
            items={[1, 2, 3, 4].map(q => ({
              label: `Квартал ${q}`,
              value: q,
            }))}
            value={[1, 2]}
            checkbox
            setValue={() => {}}
            rightIcon={<Icon name="lucide:chevron-down" size={18} />}
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
              menu: 'w-[160px] right-0',
            }}
          />
        </div>
      }
    >
      <div className="font-inter">
        <BarChart
          className="-ml-4"
          width={sectionStyle.width - 48}
          height={500}
          data={data}
        >
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            tickLine={false}
            dataKey="month"
            className="font-normal text-xs leading-full"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            className="font-normal text-sm leading-full"
            tickMargin={20}
          />
          <Tooltip />

          <Bar
            dataKey="eray"
            barSize={60}
            stackId="a"
            fill="#1f77b4"
            name="Эрай"
          />
          <Bar dataKey="neman" stackId="a" fill="#ff7f0e" name="Неман" />
          <Bar dataKey="med" stackId="a" fill="#2ca02c" name="Медсервис" />
          <Bar dataKey="bimed" stackId="a" fill="#17becf" name="Бимед" />
          <Bar dataKey="elay" stackId="a" fill="#9467bd" name="Элэй" />
        </BarChart>
      </div>
    </PageSection>
  );
});

DistributorShareDynamics.displayName = '_DistributorShareDynamics_';
