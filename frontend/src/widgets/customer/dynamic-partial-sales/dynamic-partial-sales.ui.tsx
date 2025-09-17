import React, { useState } from 'react';
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
import { Colors } from '#/shared/constants/colors';
import { Month } from '#/shared/constants/months';
import { useSize } from '#/shared/hooks/use-size';

const yearlyData: Record<
  number,
  { month: string; value: number; label: number }[]
> = {
  2024: [
    { month: Month.JAN, value: 3.0, label: 300000 },
    { month: Month.FEB, value: 4.0, label: 400000 },
    { month: Month.MAR, value: 3.5, label: 350000 },
    { month: Month.APR, value: 4.2, label: 420000 },
    { month: Month.MAY, value: 5.5, label: 550000 },
    { month: Month.JUN, value: 6.2, label: 620000 },
    { month: Month.JUL, value: 3.8, label: 380000 },
    { month: Month.AUG, value: 4.1, label: 410000 },
    { month: Month.SEP, value: 4.8, label: 480000 },
    { month: Month.OCT, value: 6.5, label: 650000 },
    { month: Month.NOV, value: 5.9, label: 590000 },
    { month: Month.DEC, value: 4.9, label: 490000 },
  ],
  2025: [
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
  ],
};

export const DynamicPartialSales: React.FC = React.memo(() => {
  const years = [2024, 2025];
  const [selectedYear, setSelectedYear] = useState(2024);
  const mainSize = useSize('main');

  return (
    <PageSection
      title="Динамика привычных продаж"
      titleBadge={{ label: '↗ 41.67%', color: '#1CC741' }}
      legends={[{ label: 'Первичные продажи', fill: '#0B5A7C' }]}
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
            dataKey="value"
            stroke={Colors.PRIMARY}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          >
            <LabelList
              dataKey="label"
              position="top"
              className="font-poppins text-xs"
            />
          </Line>
        </LineChart>
      </div>
    </PageSection>
  );
});

DynamicPartialSales.displayName = '_DynamicPartialSales_';
