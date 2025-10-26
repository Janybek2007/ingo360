import React, { useMemo } from 'react';
import { Bar, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { processPeriodData } from '#/shared/utils/process-period-data';

const generateRawData = () => {
  const currentYear = new Date().getFullYear();
  const data = [];

  for (let yearOffset = 1; yearOffset >= 0; yearOffset--) {
    const year = currentYear - yearOffset;
    for (let month = 1; month <= 12; month++) {
      const quarter = Math.ceil(month / 3);
      data.push({
        year,
        month,
        quarter,
        remains: Math.floor(Math.random() * 40) + 60,
        primary: Math.floor(Math.random() * 40) + 30,
        trade_stock: Math.floor(Math.random() * 50) + 40,
      });
    }
  }

  return data;
};

const rawData = generateRawData();

interface DynamicPrimarySalesAsMixedProps {
  period: UsePeriodType;
  selectedValues: string[];
}

export const DynamicPrimarySalesAsMixed: React.FC<DynamicPrimarySalesAsMixedProps> =
  React.memo(({ period, selectedValues }) => {
    const sectionStyle = useSectionStyle();

    const data = useMemo(() => {
      return processPeriodData({
        rawData,
        period,
        selectedValues,
        aggregateFields: ['remains', 'primary', 'trade_stock'],
      });
    }, [period, selectedValues]);

    const processedData = useMemo(
      () =>
        data.map((d, idx) => ({
          ...d,
          xIndex: `${idx}`,
        })),
      [data]
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const CustomXAxisTick = (props: any) => {
      const { x, y, payload } = props;
      const index = payload.index;
      const item = processedData[index];

      if (!item) return null;

      return (
        <g>
          <text
            x={x}
            y={y}
            textAnchor="middle"
            className="fill-black text-xs leading-full font-normal"
          >
            {item.label}
          </text>
        </g>
      );
    };

    return (
      <div className="font-inter">
        <ComposedChart
          width={sectionStyle.width - 24}
          height={500}
          margin={{ top: 20, right: 16, bottom: 20 }}
          data={processedData}
          barGap={0}
        >
          <Tooltip
            labelFormatter={label => {
              const item = processedData.find(d => d.xIndex === label);
              if (!item) return label;
              return item.fullLabel;
            }}
            formatter={(value, name) => {
              const label =
                name === 'remains'
                  ? 'Остаток'
                  : name === 'primary'
                    ? 'Первичка'
                    : 'Товарный запас';
              return [value.toLocaleString('ru-RU'), label];
            }}
          />
          <XAxis
            dataKey="xIndex"
            axisLine={false}
            // eslint-disable-next-line react-hooks/static-components
            tick={<CustomXAxisTick />}
            tickMargin={10}
            padding={{ left: 10, right: 10 }}
          />

          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            hide
            className="text-xs font-normal leading-full"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickMargin={10}
          />

          <Bar
            dataKey="remains"
            fill={'#FFC000'}
            maxBarSize={Infinity}
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="primary"
            fill={'#0B5A7C'}
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
