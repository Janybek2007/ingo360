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

const data: { month: string; value: number; label: number }[] = [
  { month: Month.JAN, value: 2.8, label: 280000 },
  { month: Month.FEB, value: 3.5, label: 350000 },
  { month: Month.MAR, value: 4.2, label: 420000 },
  { month: Month.APR, value: 3.9, label: 390000 },
  { month: Month.MAY, value: 5.0, label: 500000 },
  { month: Month.JUN, value: 5.8, label: 580000 },
  { month: Month.JUL, value: 4.0, label: 400000 },
  { month: Month.AUG, value: 3.9, label: 390000 },
  { month: Month.SEP, value: 4.5, label: 450000 },
  { month: Month.OCT, value: 6.0, label: 600000 },
  { month: Month.NOV, value: 5.3, label: 530000 },
  { month: Month.DEC, value: 4.2, label: 420000 },
];

export const OverallVisits: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  return (
    <PageSection
      title="Визитов"
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
          className="-ml-4"
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
            className="text-base text-[#474B4E] leading-full font-normal"
            padding={{ left: 20, right: 20 }}
          />

          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            axisLine={false}
            tickLine={false}
            className="text-base text-[#474B4E] leading-full font-normal"
            tickMargin={20}
          />

          <Tooltip
            labelFormatter={label => `${label}`}
            formatter={(_, __, props) => {
              const item = props?.payload;
              return [`${item.label.toLocaleString()}`, 'Визиты'];
            }}
          />

          <Line
            type="linear"
            dataKey="value"
            stroke={'#0B5A7C'}
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

OverallVisits.displayName = '_OverallVisits_';
