import React from 'react';
import { Bar, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

import { useSectionStyle } from '#/shared/hooks/use-section-style';

const data = [
  // Неделя 1 (1n): периоды 1-2-3
  { period: 1, week: 1, cycle: 1, remains: 65, tertiary: 35, trade_stock: 52 },
  { period: 2, week: 1, cycle: 1, remains: 70, tertiary: 40, trade_stock: 54 },
  { period: 3, week: 1, cycle: 1, remains: 80, tertiary: 45, trade_stock: 56 },

  // Неделя 2 (2n): периоды 4-5-6
  { period: 4, week: 2, cycle: 1, remains: 85, tertiary: 42, trade_stock: 58 },
  { period: 5, week: 2, cycle: 1, remains: 88, tertiary: 35, trade_stock: 88 },
  { period: 6, week: 2, cycle: 1, remains: 85, tertiary: 28, trade_stock: 58 },

  // Неделя 3 (3n): периоды 7-8-9
  { period: 7, week: 3, cycle: 1, remains: 75, tertiary: 55, trade_stock: 55 },
  { period: 8, week: 3, cycle: 1, remains: 75, tertiary: 60, trade_stock: 55 },
  { period: 9, week: 3, cycle: 1, remains: 85, tertiary: 28, trade_stock: 55 },

  // Неделя 4 (4n): периоды 10-11-12
  { period: 10, week: 4, cycle: 1, remains: 90, tertiary: 40, trade_stock: 50 },
  {
    period: 11,
    week: 4,
    cycle: 1,
    remains: 100,
    tertiary: 48,
    trade_stock: 80,
  },
  { period: 12, week: 4, cycle: 1, remains: 85, tertiary: 52, trade_stock: 50 },

  // Второй цикл
  { period: 1, week: 1, cycle: 2, remains: 75, tertiary: 38, trade_stock: 48 },
  { period: 2, week: 1, cycle: 2, remains: 70, tertiary: 48, trade_stock: 48 },
  { period: 3, week: 1, cycle: 2, remains: 65, tertiary: 42, trade_stock: 38 },

  { period: 4, week: 2, cycle: 2, remains: 75, tertiary: 55, trade_stock: 52 },
  { period: 5, week: 2, cycle: 2, remains: 80, tertiary: 28, trade_stock: 52 },
  { period: 6, week: 2, cycle: 2, remains: 75, tertiary: 58, trade_stock: 52 },

  { period: 7, week: 3, cycle: 2, remains: 65, tertiary: 48, trade_stock: 45 },
  { period: 8, week: 3, cycle: 2, remains: 65, tertiary: 40, trade_stock: 95 },
  { period: 9, week: 3, cycle: 2, remains: 82, tertiary: 28, trade_stock: 45 },

  { period: 10, week: 4, cycle: 2, remains: 72, tertiary: 42, trade_stock: 48 },
  { period: 11, week: 4, cycle: 2, remains: 80, tertiary: 55, trade_stock: 48 },
  { period: 12, week: 4, cycle: 2, remains: 65, tertiary: 52, trade_stock: 48 },
];

const processedData = data.map(d => ({
  ...d,
  xIndex: `${d.cycle}-${d.period}`,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const index = payload.index;
  const item = processedData[index];

  if (!item) return null;

  const isMiddleOfWeek = index % 3 === 1;

  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="middle"
        className="fill-black text-xs leading-full font-normal"
      >
        {item.period}
      </text>

      {isMiddleOfWeek && (
        <text
          x={x}
          y={y + 25}
          textAnchor="middle"
          className="fill-black text-xs leading-full font-normal"
        >
          {item.week}
        </text>
      )}
    </g>
  );
};

export const DynamicPrimarySalesAsMixed: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();

  return (
    <div className="font-inter">
      <ComposedChart
        className="-ml-4"
        width={sectionStyle.width - 48}
        height={500}
        margin={{ top: 20, right: 16, bottom: 20 }}
        data={processedData}
        barGap={0}
      >
        <Tooltip />
        <XAxis
          dataKey="xIndex"
          axisLine={false}
          tickLine={false}
          tick={<CustomXAxisTick />}
          tickMargin={10}
          padding={{ left: 10, right: 10 }}
        />

        <YAxis
          domain={[0, 100]}
          tickFormatter={value => `${value}%`}
          axisLine={false}
          tickLine={false}
          className="text-xs font-normal leading-full"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickMargin={10}
        />

        <Bar
          dataKey="remains"
          fill={'#0B5A7C'}
          maxBarSize={Infinity}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="tertiary"
          fill={'#FFC000'}
          maxBarSize={Infinity}
          radius={[0, 0, 0, 0]}
        />

        <Line
          type="linear"
          dataKey="trade_stock"
          stroke={'#888888'}
          strokeWidth={3}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </div>
  );
});

DynamicPrimarySalesAsMixed.displayName = '_DynamicPrimarySalesAsMixed_';
