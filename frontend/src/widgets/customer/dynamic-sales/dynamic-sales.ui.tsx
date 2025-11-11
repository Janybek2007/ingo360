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

import { DbQueries, type TDbItem } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { calculateChartAxis } from '#/shared/utils/calculate';
import { generateChartRawData } from '#/shared/utils/generate-chart-raw-data';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { processPeriodData } from '#/shared/utils/process-period-data';

export const DynamicSales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/primary/reports/sales', 'sales/secondary/reports/sales'],
      {
        type_period: periodFilter.period,
        filterValues: periodFilter.selectedValues,
      }
    )
  );

  const primarySales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const secondarySales = React.useMemo(
    () => (queryData.data ? queryData.data[1] : []),
    [queryData.data]
  );

  const rawData = React.useMemo(() => {
    const primaryRawData = generateChartRawData(primarySales, {
      valueField: 'amount',
      outputField: 'primaryValue',
    });

    const secondaryRawData = generateChartRawData(secondarySales, {
      valueField: 'amount',
      outputField: 'secondaryValue',
    });

    // Объединяем оба набора данных
    const dataMap = new Map<
      string,
      {
        year: number;
        month: number;
        quarter: number;
        primaryValue: number;
        secondaryValue: number;
      }
    >();

    primaryRawData.forEach(item => {
      const key = `${item.year}-${item.month}`;
      dataMap.set(key, {
        year: item.year,
        month: item.month,
        quarter: item.quarter,
        primaryValue: item.primaryValue || 0,
        secondaryValue: 0,
      });
    });

    secondaryRawData.forEach(item => {
      const key = `${item.year}-${item.month}`;
      const existing = dataMap.get(key);
      if (existing) {
        existing.secondaryValue = item.secondaryValue || 0;
      } else {
        dataMap.set(key, {
          year: item.year,
          month: item.month,
          quarter: item.quarter,
          primaryValue: 0,
          secondaryValue: item.secondaryValue || 0,
        });
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [primarySales, secondarySales]);

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
  }, [periodFilter.period, periodFilter.selectedValues, rawData]);

  const chartAxis = useMemo(
    () => calculateChartAxis(data, ['primaryValue', 'secondaryValue']),
    [data]
  );

  return (
    <PageSection
      title={`Динамика первичных и вторичных продаж`}
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
      <UsedFilter
        usedPeriodFilters={getUsedFilterItems([
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
        ])}
        resetFilters={resetFilters}
        isViewPeriods={periodFilter.isView}
      />
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <div className="space-y-4">
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
                tickFormatter={value => Number(value).toLocaleString('ru-RU')}
              />
              <Tooltip
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullLabel || label;
                  }
                  return label;
                }}
                formatter={(value, name) => {
                  const label =
                    name === 'primaryValue' ? 'Первичка' : 'Вторичка';
                  return [value.toLocaleString('ru-RU'), label];
                }}
              />
              <Line
                type="linear"
                dataKey="primaryValue"
                stroke={'#0B5A7C'}
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 5, fill: '#0B5A7C' }}
                connectNulls={false}
              >
                <LabelList
                  dataKey="primaryValue"
                  position="top"
                  className="font-inter text-xs"
                  formatter={value => {
                    if (value === undefined || value === null || value === 0)
                      return '';
                    return Number(value as number).toLocaleString('ru-RU');
                  }}
                />
              </Line>
              <Line
                type="linear"
                dataKey="secondaryValue"
                stroke={'#E97030'}
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 5, fill: '#E97030' }}
                connectNulls={false}
              >
                <LabelList
                  dataKey="secondaryValue"
                  position="top"
                  className="font-inter text-xs"
                  formatter={value => {
                    if (value === undefined || value === null || value === 0)
                      return '';
                    return Number(value as number).toLocaleString('ru-RU');
                  }}
                />
              </Line>
            </LineChart>
          </div>
        </div>
      </AsyncBoundary>
    </PageSection>
  );
});

DynamicSales.displayName = '_DynamicSales_';
