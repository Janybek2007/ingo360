import React, { useMemo } from 'react';
import { Bar, ComposedChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

import { useSectionStyle } from '#/shared/hooks/use-section-style';

const rawData = [
  // Неделя 1 (1n): периоды 1-2-3
  { period: 1, week: 1, cycle: 1, remains: 65, primary: 35, trade_stock: 52 },
  { period: 2, week: 1, cycle: 1, remains: 70, primary: 40, trade_stock: 54 },
  { period: 3, week: 1, cycle: 1, remains: 80, primary: 45, trade_stock: 56 },

  // Неделя 2 (2n): периоды 4-5-6
  { period: 4, week: 2, cycle: 1, remains: 85, primary: 42, trade_stock: 58 },
  { period: 5, week: 2, cycle: 1, remains: 88, primary: 35, trade_stock: 88 },
  { period: 6, week: 2, cycle: 1, remains: 85, primary: 28, trade_stock: 58 },

  // Неделя 3 (3n): периоды 7-8-9
  { period: 7, week: 3, cycle: 1, remains: 75, primary: 55, trade_stock: 55 },
  { period: 8, week: 3, cycle: 1, remains: 75, primary: 60, trade_stock: 55 },
  { period: 9, week: 3, cycle: 1, remains: 85, primary: 28, trade_stock: 55 },

  // Неделя 4 (4n): периоды 10-11-12
  { period: 10, week: 4, cycle: 1, remains: 90, primary: 40, trade_stock: 50 },
  {
    period: 11,
    week: 4,
    cycle: 1,
    remains: 100,
    primary: 48,
    trade_stock: 80,
  },
  { period: 12, week: 4, cycle: 1, remains: 85, primary: 52, trade_stock: 50 },

  // Второй цикл
  { period: 1, week: 1, cycle: 2, remains: 75, primary: 38, trade_stock: 48 },
  { period: 2, week: 1, cycle: 2, remains: 70, primary: 48, trade_stock: 48 },
  { period: 3, week: 1, cycle: 2, remains: 65, primary: 42, trade_stock: 38 },

  { period: 4, week: 2, cycle: 2, remains: 75, primary: 55, trade_stock: 52 },
  { period: 5, week: 2, cycle: 2, remains: 80, primary: 28, trade_stock: 52 },
  { period: 6, week: 2, cycle: 2, remains: 75, primary: 58, trade_stock: 52 },

  { period: 7, week: 3, cycle: 2, remains: 65, primary: 48, trade_stock: 45 },
  { period: 8, week: 3, cycle: 2, remains: 65, primary: 40, trade_stock: 95 },
  { period: 9, week: 3, cycle: 2, remains: 82, primary: 28, trade_stock: 45 },

  { period: 10, week: 4, cycle: 2, remains: 72, primary: 42, trade_stock: 48 },
  { period: 11, week: 4, cycle: 2, remains: 80, primary: 55, trade_stock: 48 },
  { period: 12, week: 4, cycle: 2, remains: 65, primary: 52, trade_stock: 48 },
];

interface DynamicPrimarySalesAsMixedProps {
  period: 'year' | 'month' | 'quarter';
}

export const DynamicPrimarySalesAsMixed: React.FC<DynamicPrimarySalesAsMixedProps> =
  React.memo(({ period }) => {
    const sectionStyle = useSectionStyle();

    const data = useMemo(() => {
      if (period === 'month') {
        return rawData;
      }

      if (period === 'year') {
        // Группируем по циклам (годам)
        const cycles = rawData.reduce(
          (acc, item) => {
            if (!acc[item.cycle]) {
              acc[item.cycle] = {
                period: item.cycle,
                week: item.cycle,
                cycle: item.cycle,
                remains: 0,
                primary: 0,
                trade_stock: 0,
                count: 0,
              };
            }
            acc[item.cycle].remains += item.remains;
            acc[item.cycle].primary += item.primary;
            acc[item.cycle].trade_stock += item.trade_stock;
            acc[item.cycle].count += 1;
            return acc;
          },
          {} as Record<
            number,
            {
              period: number;
              week: number;
              cycle: number;
              remains: number;
              primary: number;
              trade_stock: number;
              count: number;
            }
          >
        );

        // Вычисляем средние значения
        return Object.values(cycles).map(item => ({
          period: item.period,
          week: item.week,
          cycle: item.cycle,
          remains: Math.round(item.remains / item.count),
          primary: Math.round(item.primary / item.count),
          trade_stock: Math.round(item.trade_stock / item.count),
        }));
      }

      // quarter - группируем по неделям
      const weeks = rawData.reduce(
        (acc, item) => {
          const key = `${item.cycle}-${item.week}`;
          if (!acc[key]) {
            acc[key] = {
              period: item.week,
              week: item.week,
              cycle: item.cycle,
              remains: 0,
              primary: 0,
              trade_stock: 0,
              count: 0,
            };
          }
          acc[key].remains += item.remains;
          acc[key].primary += item.primary;
          acc[key].trade_stock += item.trade_stock;
          acc[key].count += 1;
          return acc;
        },
        {} as Record<
          string,
          {
            period: number;
            week: number;
            cycle: number;
            remains: number;
            primary: number;
            trade_stock: number;
            count: number;
          }
        >
      );

      // Вычисляем средние значения
      return Object.values(weeks).map(item => ({
        period: item.period,
        week: item.week,
        cycle: item.cycle,
        remains: Math.round(item.remains / item.count),
        primary: Math.round(item.primary / item.count),
        trade_stock: Math.round(item.trade_stock / item.count),
      }));
    }, [period]);

    const processedData = useMemo(
      () =>
        data.map(d => ({
          ...d,
          xIndex: `${d.cycle}-${d.period}`,
        })),
      [data]
    );

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

          {isMiddleOfWeek && period === 'month' && (
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

              if (period === 'year') {
                return `Год ${item.cycle}`;
              }
              if (period === 'quarter') {
                return `Цикл ${item.cycle}, Неделя ${item.week}`;
              }
              // month
              return `Цикл ${item.cycle}, Период ${item.period}`;
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
            tickLine={false}
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
