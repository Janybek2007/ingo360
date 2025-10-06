import React from 'react';
import {
  CartesianGrid,
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

const data: {
  month: string;
  primaryValue: number;
  secondaryValue?: number;
}[] = [
  { month: Month.JAN, primaryValue: 2.8, secondaryValue: 3.2 },
  { month: Month.FEB, primaryValue: 3.5, secondaryValue: 3.9 },
  { month: Month.MAR, primaryValue: 4.2, secondaryValue: 4.0 },
  { month: Month.APR, primaryValue: 3.9, secondaryValue: 4.1 },
  { month: Month.MAY, primaryValue: 5.0, secondaryValue: 5.3 },
  { month: Month.JUN, primaryValue: 5.8, secondaryValue: 5.5 },
  { month: Month.JUL, primaryValue: 4.0, secondaryValue: 4.4 },
  { month: Month.AUG, primaryValue: 3.9, secondaryValue: 4.1 },
  { month: Month.SEP, primaryValue: 4.5, secondaryValue: 4.8 },
  { month: Month.OCT, primaryValue: 6.0, secondaryValue: 5.7 },
  { month: Month.NOV, primaryValue: 5.3, secondaryValue: 5.6 },
  { month: Month.DEC, primaryValue: 4.2, secondaryValue: 4.5 },
];

export const DynamicSales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();

  return (
    <PageSection
      title="Динамика первичных и вторичных продаж"
      legends={[
        { label: 'Первичное значение', fill: '#0B5A7C' },
        { label: 'Вторичное значение', fill: '#E97030' },
      ]}
      headerEnd={
        <div>
          <div className="flex items-center gap-4">
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
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            className="text-base font-normal text-[#474B4E] leading-full"
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            axisLine={false}
            tickLine={false}
            className="text-base font-normal text-[#474B4E] leading-full"
            tickMargin={20}
          />
          <Tooltip />
          <Line
            type="linear"
            dataKey="primaryValue"
            stroke={'#0B5A7C'}
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
          <Line
            type="linear"
            dataKey="secondaryValue"
            stroke={'#E97030'}
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </PageSection>
  );
});

DynamicSales.displayName = '_DynamicSales_';
