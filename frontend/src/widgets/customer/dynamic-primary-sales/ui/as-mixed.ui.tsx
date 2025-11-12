import React, { useMemo } from 'react';
import { Bar, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { processPeriodData } from '#/shared/utils/process-period-data';

import type { DynamicPrimarySalesAsMixedProps } from '../dynamic-primary-sales.types';

export const DynamicPrimarySalesAsMixed: React.FC<DynamicPrimarySalesAsMixedProps> =
  React.memo(
    ({ period, selectedValues, sales: processedSalesData, indicator }) => {
      const sectionStyle = useSectionStyle();

      const rawData = useMemo(() => {
        return processedSalesData.map(item => {
          const [year, month] = item.period.split('-').map(Number);
          const quarter = Math.ceil(month / 3);

          return {
            year,
            month,
            quarter,
            primary:
              indicator === 'packages'
                ? item.sales_packages
                : item.sales_amount,
            remains:
              indicator === 'packages'
                ? item.stock_packages
                : item.stock_amount,
            trade_stock: item.coverage_months,
          };
        });
      }, [processedSalesData, indicator]);

      const data = useMemo(() => {
        return processPeriodData({
          rawData,
          period,
          selectedValues,
          aggregateFields: ['remains', 'primary', 'trade_stock'],
        });
      }, [rawData, period, selectedValues]);

      const processedData = useMemo(
        () =>
          data.map((d, idx) => ({
            ...d,
            xIndex: `${idx}`,
          })),
        [data]
      );

      const tradeStockMax = useMemo(() => {
        return Math.max(...processedData.map(d => (d as any).trade_stock)) + 10;
      }, [processedData]);

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

            <YAxis yAxisId="lineAxis" domain={[0, tradeStockMax]} hide />

            <YAxis
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
              yAxisId="lineAxis"
              stroke={'#888888'}
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </div>
      );
    }
  );

DynamicPrimarySalesAsMixed.displayName = '_DynamicPrimarySalesAsMixed_';
