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
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
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
        primaryValue: Math.floor(Math.random() * 200000) + 300000,
        secondaryValue: Math.floor(Math.random() * 200000) + 350000,
      });
    }
  }

  return data;
};

const rawData = generateRawData();

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
    return processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: ['primaryValue', 'secondaryValue'],
    });
  }, [periodFilter.period, periodFilter.selectedValues]);

  const chartAxis = useMemo(
    () => calculateChartAxis(data, ['primaryValue', 'secondaryValue']),
    [data]
  );

  return (
    <PageSection
      title="Динамика первичных и вторичных продаж"
      legends={[
        { label: 'Первичные продажи', fill: '#0B5A7C' },
        { label: 'Вторичные продажи', fill: '#E97030' },
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
