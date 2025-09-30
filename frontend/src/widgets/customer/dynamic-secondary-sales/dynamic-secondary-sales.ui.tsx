import React from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PageSection } from '#/shared/components/page-section';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { allMonths, MonthNumber } from '#/shared/constants/months';
import { useSectionStyle } from '#/shared/hooks/use-section-style';

const data = [
  { month: MonthNumber.JAN, value: 120 },
  { month: MonthNumber.FEB, value: 150 },
  { month: MonthNumber.MAR, value: 135 },
  { month: MonthNumber.APR, value: 160 },
  { month: MonthNumber.MAY, value: 145 },
  { month: MonthNumber.JUN, value: 170 },
  { month: MonthNumber.JUL, value: 155 },
  { month: MonthNumber.AUG, value: 180 },
  { month: MonthNumber.SEP, value: 165 },
  { month: MonthNumber.OCT, value: 190 },
  { month: MonthNumber.NOV, value: 175 },
  { month: MonthNumber.DEC, value: 200 },
];

export const DynamicSecondarySales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  return (
    <PageSection
      legends={[{ label: 'Вторичное значение', fill: '#E97030' }]}
      title="Динамика вторичных продаж"
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
        <LineChart
          className="-ml-2"
          width={sectionStyle.width - 48}
          height={500}
          data={data}
          margin={{ top: 20, right: 16, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            className="text-[#474B4E] font-normal text-base leading-full"
            padding={{ left: 20, right: 20 }}
          />

          <YAxis
            domain={[0, 250]}
            ticks={[0, 50, 100, 150, 200, 250]}
            axisLine={false}
            tickLine={false}
            className="text-[#474B4E] font-normal text-base leading-full"
            tickMargin={20}
          />

          <Tooltip />

          <Line
            type="linear"
            dataKey="value"
            stroke={'#E97030'}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          >
            <LabelList
              dataKey="value"
              position="top"
              className="font-inter text-xs"
            />
          </Line>
        </LineChart>
      </div>
    </PageSection>
  );
});

DynamicSecondarySales.displayName = '_DynamicSecondarySales_';
