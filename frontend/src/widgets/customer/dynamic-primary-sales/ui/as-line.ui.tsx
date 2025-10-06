import React from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
} from 'recharts';

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

export const DynamicPrimarySalesAsLine: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();

  return (
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
          className="text-base text-[#474B4E] leading-full font-normal"
          padding={{ left: 30, right: 30 }}
        />

        <Tooltip
          labelFormatter={label => `${label}`}
          formatter={(_, __, props) => {
            const item = props?.payload;
            return [`${item.label.toLocaleString()}`, 'Первичка'];
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
  );
});

DynamicPrimarySalesAsLine.displayName = '_DynamicPrimarySalesAsLine_';
