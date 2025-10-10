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

import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { Month } from '#/shared/constants/months';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

const rawData: {
  month: string;
  primaryValue: number;
  secondaryValue: number;
  monthIndex: number;
}[] = [
  {
    month: Month.JAN,
    primaryValue: 280000,
    secondaryValue: 320000,
    monthIndex: 0,
  },
  {
    month: Month.FEB,
    primaryValue: 350000,
    secondaryValue: 390000,
    monthIndex: 1,
  },
  {
    month: Month.MAR,
    primaryValue: 420000,
    secondaryValue: 400000,
    monthIndex: 2,
  },
  {
    month: Month.APR,
    primaryValue: 390000,
    secondaryValue: 410000,
    monthIndex: 3,
  },
  {
    month: Month.MAY,
    primaryValue: 500000,
    secondaryValue: 530000,
    monthIndex: 4,
  },
  {
    month: Month.JUN,
    primaryValue: 580000,
    secondaryValue: 550000,
    monthIndex: 5,
  },
  {
    month: Month.JUL,
    primaryValue: 440000,
    secondaryValue: 440000,
    monthIndex: 6,
  },
  {
    month: Month.AUG,
    primaryValue: 390000,
    secondaryValue: 410000,
    monthIndex: 7,
  },
  {
    month: Month.SEP,
    primaryValue: 450000,
    secondaryValue: 480000,
    monthIndex: 8,
  },
  {
    month: Month.OCT,
    primaryValue: 600000,
    secondaryValue: 570000,
    monthIndex: 9,
  },
  {
    month: Month.NOV,
    primaryValue: 530000,
    secondaryValue: 560000,
    monthIndex: 10,
  },
  {
    month: Month.DEC,
    primaryValue: 420000,
    secondaryValue: 450000,
    monthIndex: 11,
  },
];

export const DynamicSales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const periodFilter = usePeriodFilter();

  const usedFilterItems = useMemo(() => {
    return getUsedFilterItems([
      {
        value: periodFilter.selectedValues,
        getLabelFromValue: getPeriodLabel,
        onDelete: value => {
          const newValues = periodFilter.selectedValues.filter(
            v => v !== value
          );
          periodFilter.onChange(newValues);
        },
      },
    ]);
  }, [periodFilter]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
  }, [periodFilter]);

  const data = useMemo(() => {
    if (periodFilter.period === 'month') {
      return rawData;
    }

    if (periodFilter.period === 'year') {
      const currentYearPrimary = rawData.reduce(
        (sum, item) => sum + item.primaryValue,
        0
      );
      const currentYearSecondary = rawData.reduce(
        (sum, item) => sum + item.secondaryValue,
        0
      );

      return [
        {
          month: '2021',
          primaryValue: currentYearPrimary * 0.7,
          secondaryValue: currentYearSecondary * 0.7,
          monthIndex: 0,
        },
        {
          month: '2022',
          primaryValue: currentYearPrimary * 0.85,
          secondaryValue: currentYearSecondary * 0.85,
          monthIndex: 1,
        },
        {
          month: '2023',
          primaryValue: currentYearPrimary * 0.95,
          secondaryValue: currentYearSecondary * 0.95,
          monthIndex: 2,
        },
        {
          month: '2024',
          primaryValue: currentYearPrimary,
          secondaryValue: currentYearSecondary,
          monthIndex: 3,
        },
      ];
    }

    // quarter
    const quarters = [
      { month: 'Q1', primaryValue: 0, secondaryValue: 0, monthIndex: 0 },
      { month: 'Q2', primaryValue: 0, secondaryValue: 0, monthIndex: 1 },
      { month: 'Q3', primaryValue: 0, secondaryValue: 0, monthIndex: 2 },
      { month: 'Q4', primaryValue: 0, secondaryValue: 0, monthIndex: 3 },
    ];

    rawData.forEach(item => {
      const quarterIndex = Math.floor(item.monthIndex / 3);
      quarters[quarterIndex].primaryValue += item.primaryValue;
      quarters[quarterIndex].secondaryValue += item.secondaryValue;
    });

    return quarters;
  }, [periodFilter.period]);

  const chartAxis = useMemo(
    () => calculateChartAxis(data, ['primaryValue', 'secondaryValue']),
    [data]
  );

  return (
    <PageSection
      title="Динамика первичных и вторичных продаж"
      legends={[
        { label: 'Первичное значение', fill: '#0B5A7C' },
        { label: 'Вторичное значение', fill: '#E97030' },
      ]}
      headerEnd={
        <div className="flex items-center gap-4">
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
      <div className="space-y-4">
        <UsedFilter
          usedFilterItems={usedFilterItems}
          resetFilters={resetFilters}
        />

        <div className="font-inter">
          <LineChart
            width={sectionStyle.width - 48}
            height={500}
            data={data}
            margin={{ top: 20, right: 16, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={20}
              className="text-base font-normal text-[#474B4E] leading-full"
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
              labelFormatter={label => `${label}`}
              formatter={(value, name) => {
                const label = name === 'primaryValue' ? 'Первичка' : 'Вторичка';
                return [value.toLocaleString('ru-RU'), label];
              }}
            />
            <Line
              type="linear"
              dataKey="primaryValue"
              stroke={'#0B5A7C'}
              strokeWidth={3}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="primaryValue"
                position="top"
                className="font-inter text-xs"
                formatter={value => formatCompactNumber(value as number)}
              />
            </Line>
            <Line
              type="linear"
              dataKey="secondaryValue"
              stroke={'#E97030'}
              strokeWidth={3}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="secondaryValue"
                position="top"
                className="font-inter text-xs"
                formatter={value => formatCompactNumber(value as number)}
              />
            </Line>
          </LineChart>
        </div>
      </div>
    </PageSection>
  );
});

DynamicSales.displayName = '_DynamicSales_';
