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
import { calculateChartAxis } from '#/shared/utils/calculate';
import { parsePeriodData } from '#/shared/utils/parse-period-data';

import type { DynamicPrimarySalesAsLineProps } from '../dynamic-primary-sales.types';

export const DynamicPrimarySalesAsLine: React.FC<DynamicPrimarySalesAsLineProps> =
  React.memo(({ sales, period, indicator }) => {
    const sectionStyle = useSectionStyle();

    const rawData = useMemo(() => {
      return sales.map(item => {
        const parsed = parsePeriodData(item.period, period);

        return {
          label: parsed.label,
          fullLabel: parsed.label,
          value:
            indicator === 'packages' ? item.sales_packages : item.sales_amount,
        };
      });
    }, [sales, indicator, period]);

    const chartAxis = useMemo(
      () => calculateChartAxis(rawData, ['value']),
      [rawData]
    );

    return (
      <div className="font-inter">
        <LineChart
          width={sectionStyle.width - 48}
          height={500}
          data={rawData}
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
            tickFormatter={value => Number(value).toLocaleString('ru-RU')}
          />

          <Tooltip
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullLabel || label;
              }
              return label;
            }}
            formatter={value => {
              return [value.toLocaleString('ru-RU'), 'Первичка'];
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
                return Number(value as number).toLocaleString('ru-RU');
              }}
            />
          </Line>
        </LineChart>
      </div>
    );
  });

DynamicPrimarySalesAsLine.displayName = '_DynamicPrimarySalesAsLine_';
