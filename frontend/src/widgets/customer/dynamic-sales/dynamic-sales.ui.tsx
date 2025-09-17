import React, { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PageSection } from '#/shared/components/page-section';
import { Colors } from '#/shared/constants/colors';
import { Month } from '#/shared/constants/months';
import { useSize } from '#/shared/hooks/use-size';

const yearlyData: Record<
  number,
  { month: string; primaryValue: number; secondaryValue?: number }[]
> = {
  2024: [
    { month: Month.JAN, primaryValue: 3.0, secondaryValue: 7.0 },
    { month: Month.FEB, primaryValue: 4.0, secondaryValue: 2 },
    { month: Month.MAR, primaryValue: 3.5 },
    { month: Month.APR, primaryValue: 4.2, secondaryValue: 3.9 },
    { month: Month.MAY, primaryValue: 5.5, secondaryValue: 5.0 },
    { month: Month.JUN, primaryValue: 6.2, secondaryValue: 5.8 },
    { month: Month.JUL, primaryValue: 3.8 },
    { month: Month.AUG, primaryValue: 4.1, secondaryValue: 4.3 },
    { month: Month.SEP, primaryValue: 4.8, secondaryValue: 4.6 },
    { month: Month.OCT, primaryValue: 6.5, secondaryValue: 6.0 },
    { month: Month.NOV, primaryValue: 5.9 },
    { month: Month.DEC, primaryValue: 4.9 },
  ],
  2025: [
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
  ],
};

export const DynamicSales: React.FC = React.memo(() => {
  const years = [2024, 2025];
  const [selectedYear, setSelectedYear] = useState(2024);
  const mainSize = useSize('main');

  return (
    <PageSection
      title="Динамика первичных и вторичных продаж"
      legends={[
        { label: 'Первичное значение', fill: '#0B5A7C' },
        { label: 'Вторичное значение', fill: '#E97030' },
      ]}
      headerEnd={
        <select
          className="border px-3 py-1 rounded cursor-pointer"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      }
      background="white"
      variant="background"
    >
      <div>
        <LineChart
          className="-ml-4"
          width={mainSize.width - 80}
          height={300}
          data={yearlyData[selectedYear]}
          margin={{ top: 20, right: 16, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={20}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            axisLine={false}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Line
            type="linear"
            dataKey="primaryValue"
            stroke={Colors.PRIMARY}
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
          <Line
            type="linear"
            dataKey="secondaryValue"
            stroke={Colors.SECONDARY}
            strokeWidth={3}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </div>
    </PageSection>
  );
});

DynamicSales.displayName = '_DynamicSales_';
