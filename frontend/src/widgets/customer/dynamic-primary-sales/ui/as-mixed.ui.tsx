import React, { useMemo } from 'react';
import {
  Bar,
  ComposedChart,
  LabelList,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { parsePeriodData } from '#/shared/utils/parse-period-data';
import { PeriodSorting } from '#/shared/utils/period-sorting';

import type { DynamicPrimarySalesAsMixedProps as DynamicPrimarySalesAsMixedProperties } from '../dynamic-primary-sales.types';

export const DynamicPrimarySalesAsMixed: React.FC<DynamicPrimarySalesAsMixedProperties> =
  React.memo(({ period, sales: salesData, indicator }) => {
    const sectionStyle = useSectionStyle();

    const processedData = useMemo(() => {
      return salesData
        .toSorted(PeriodSorting.sortByPeriod(period))
        .map((item, index) => {
          const parsed = parsePeriodData(item.period, period);

          return {
            label: parsed.value,
            fullLabel: parsed.label,
            primary:
              indicator === 'packages'
                ? item.sales_packages
                : item.sales_amount,
            remains:
              indicator === 'packages'
                ? item.stock_packages
                : item.stock_amount,
            trade_stock:
              indicator === 'packages'
                ? item.coverage_months_packages
                : item.coverage_months_amount,
            xIndex: `${index}`,
          };
        });
    }, [salesData, indicator, period]);

    const tradeStockMax = useMemo(() => {
      return Math.max(...processedData.map(d => d.trade_stock)) + 10;
    }, [processedData]);

    const CustomXAxisTick = (properties: any) => {
      const { x, y, payload } = properties;
      const index = payload.index;
      const item = processedData[index];

      if (!item) return null;

      return (
        <g>
          <text
            x={x}
            y={y}
            textAnchor="middle"
            className="leading-full fill-black text-xs font-normal"
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
              if (value == null) return null;
              const labelName =
                name === 'primary' ? 'Первичные продажи' : 'Товарный запас';
              const label = name === 'remains' ? 'Остаток' : labelName;
              return [value.toLocaleString('ru-RU'), label];
            }}
          />
          <XAxis
            dataKey="xIndex"
            axisLine={false}
            // eslint-disable-next-line react-hooks/static-components
            tick={<CustomXAxisTick />}
            tickMargin={10}
            padding={{ left: 55, right: 10 }}
          />

          <YAxis yAxisId="lineAxis" domain={[0, tradeStockMax]} hide />

          <YAxis
            axisLine={false}
            tickLine={false}
            hide
            className="leading-full text-xs font-normal"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickMargin={10}
          />

          <Bar
            dataKey="remains"
            fill={'#FFC000'}
            maxBarSize={Infinity}
            radius={[0, 0, 0, 0]}
          >
            <LabelList
              dataKey="remains"
              position="top"
              formatter={value => Number(value).toLocaleString('ru-RU')}
              className="fill-black text-xs"
            />
          </Bar>

          <Bar
            dataKey="primary"
            fill={'#0B5A7C'}
            maxBarSize={Infinity}
            radius={[0, 0, 0, 0]}
          >
            <LabelList
              dataKey="primary"
              position="top"
              formatter={value => Number(value).toLocaleString('ru-RU')}
              className="fill-black text-xs"
            />
          </Bar>

          <Line
            type="linear"
            dataKey="trade_stock"
            yAxisId="lineAxis"
            stroke={'#888888'}
            strokeWidth={3}
            activeDot={{ r: 6 }}
            label={{
              position: 'top',
              fill: '#000',
              fontSize: 10,
              formatter: value => Number(value).toLocaleString('ru-RU'),
            }}
          />
        </ComposedChart>
      </div>
    );
  });

DynamicPrimarySalesAsMixed.displayName = '_DynamicPrimarySalesAsMixed_';
