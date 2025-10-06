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
import { Select } from '#/shared/components/ui/select';
import { Month } from '#/shared/constants/months';
import { useSectionStyle } from '#/shared/hooks/use-section-style';

const data = [
  { month: Month.JAN, value: 120, label: 120000 },
  { month: Month.FEB, value: 150, label: 150000 },
  { month: Month.MAR, value: 135, label: 135000 },
  { month: Month.APR, value: 160, label: 160000 },
  { month: Month.MAY, value: 145, label: 145000 },
  { month: Month.JUN, value: 170, label: 170000 },
  { month: Month.JUL, value: 155, label: 155000 },
  { month: Month.AUG, value: 180, label: 180000 },
  { month: Month.SEP, value: 165, label: 165000 },
  { month: Month.OCT, value: 190, label: 190000 },
  { month: Month.NOV, value: 175, label: 175000 },
  { month: Month.DEC, value: 200, label: 200000 },
];

export const DynamicSecondarySales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  return (
    <PageSection
      title="Динамика вторичных продаж"
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<false, string>
            value={'brand1'}
            setValue={() => {}}
            items={[
              { value: 'brand1', label: 'Бренд 1' },
              { value: 'brand2', label: 'Бренд 2' },
              { value: 'brand3', label: 'Бренд 3' },
            ]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={'group1'}
            setValue={() => {}}
            items={[
              { value: 'group1', label: 'Группа 1' },
              { value: 'group2', label: 'Группа 2' },
              { value: 'group3', label: 'Группа 3' },
            ]}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select
            triggerText={'Год/Месяц/Квартал'}
            items={[
              { label: 'Год', value: 'year' },
              { label: 'Месяц', value: 'month' },
              { label: 'Квартал', value: 'quarter' },
            ]}
            value={'year'}
            setValue={() => {}}
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[7.5rem] justify-between',
              menu: 'w-full right-0',
            }}
          />
        </div>
      }
    >
      <div className="font-inter">
        <LineChart
          width={sectionStyle.width - 48}
          height={500}
          data={data}
          margin={{ top: 20, right: 16, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            className="text-[#474B4E] font-normal text-base leading-full"
            padding={{ left: 30, right: 30 }}
          />

          <YAxis
            domain={[0, 250]}
            ticks={[0, 50, 100, 150, 200, 250]}
            axisLine={false}
            tickLine={false}
            hide
            className="text-[#474B4E] font-normal text-base leading-full"
            tickMargin={20}
          />

          <Tooltip
            labelFormatter={label => `${label}`}
            formatter={(_, __, props) => {
              const item = props?.payload;
              return [`${item.label.toLocaleString()}`, 'Вторичка'];
            }}
          />

          <Line
            type="linear"
            dataKey="value"
            stroke={'#E97030'}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          >
            <LabelList
              dataKey="label"
              position="top"
              className="font-inter text-xs"
              formatter={value => value?.toLocaleString()}
            />
          </Line>
        </LineChart>
      </div>
    </PageSection>
  );
});

DynamicSecondarySales.displayName = '_DynamicSecondarySales_';
