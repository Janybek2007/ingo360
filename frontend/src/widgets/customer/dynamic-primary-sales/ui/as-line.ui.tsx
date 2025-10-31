import React, { useMemo } from 'react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
import { processPeriodData } from '#/shared/utils/process-period-data';

import type { DynamicPrimarySalesAsLineProps } from '../dynamic-primary-sales.types';

export const DynamicPrimarySalesAsLine: React.FC<DynamicPrimarySalesAsLineProps> =
  React.memo(({ sales, period }) => {
    const sectionStyle = useSectionStyle();

    const rawData = useMemo(() => {
      const dataMap = new Map<
        string,
        {
          year: number;
          month: number;
          quarter: number;
          value: number;
        }
      >();

      sales.forEach(item => {
        if (!item.months || !Array.isArray(item.months)) return;

        item.months.forEach((value, index) => {
          if (value !== null) {
            const month = index + 1;
            const year = item.year;
            const quarter = Math.ceil(month / 3);
            const key = `${year}-${month}`;

            const existing = dataMap.get(key) || {
              year,
              month,
              quarter,
              value: 0,
            };
            existing.value += value;
            dataMap.set(key, existing);
          }
        });
      });

      return Array.from(dataMap.values()).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
    }, [sales]);

    const data = useMemo(() => {
      return processPeriodData({
        rawData,
        period,
        selectedValues: [],
        aggregateFields: ['value'],
      });
    }, [rawData, period]);

    const chartAxis = useMemo(
      () => calculateChartAxis(data, ['value']),
      [data]
    );

    return (
      <div className="font-inter">
        <LineChart
          width={sectionStyle.width - 48}
          height={500}
          data={data}
          margin={{ top: 20, right: 16, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" vertical={false} />

          <XAxis
            dataKey="label"
            axisLine={false}
            tickMargin={20}
            className="text-base text-[#474B4E] leading-full font-normal"
            padding={{ left: 30, right: 30 }}
          />

          <YAxis
            domain={chartAxis.domain}
            ticks={chartAxis.ticks}
            axisLine={false}
            tickLine={false}
            hide
            className="text-base font-normal text-[#474B4E] leading-full"
            tickMargin={20}
            tickFormatter={value => formatCompactNumber(value)}
          />

          <Tooltip
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullLabel || label;
              }
              return label;
            }}
            formatter={(value, name) => {
              const label = name === 'primaryValue' ? 'Первичка' : 'Вторичка';
              return [value.toLocaleString('ru-RU'), label];
            }}
          />

          <Line
            type="linear"
            dataKey="value"
            stroke={'#0B5A7C'}
            strokeWidth={3}
            dot={{ r: 5, fill: '#0B5A7C' }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          >
            <LabelList
              dataKey="value"
              position="top"
              className="font-inter text-xs"
              formatter={value => {
                if (value === undefined || value === null) return '';
                return formatCompactNumber(value as number);
              }}
            />
          </Line>
        </LineChart>
      </div>
    );
  });

DynamicPrimarySalesAsLine.displayName = '_DynamicPrimarySalesAsLine_';
