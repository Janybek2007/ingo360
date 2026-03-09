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

import { DbQueries } from '#/entities/db';
import { AsyncBoundary } from '#/shared/components/async-boundry';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { useSession } from '#/shared/session';
import { calculateChartAxis } from '#/shared/utils/calculate';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { parsePeriodData } from '#/shared/utils/parse-period-data';
import { PeriodSorting } from '#/shared/utils/period-sorting';

type DynamicPrimarySalesData = {
  period: string;
  sales_amount: number;
  sales: number;
};

export const DynamicSales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const lastYear = useSession(s => s.lastYear);
  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.primary,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<DynamicPrimarySalesData[]>(
      ['sales/primary/reports/chart', 'sales/secondary/reports/chart'],
      {
        group_by_period: periodFilter.period,
        period_values: periodFilter.selectedValues,

        method: 'POST',
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
    const dataMap = new Map<
      string,
      { period: string; primaryValue: number; secondaryValue: number }
    >();

    for (const item of primarySales) {
      dataMap.set(item.period, {
        period: item.period,
        primaryValue: item.sales_amount,
        secondaryValue: 0,
      });
    }

    for (const item of secondarySales) {
      const existing = dataMap.get(item.period);

      if (existing) {
        existing.secondaryValue = item.sales;
      } else {
        dataMap.set(item.period, {
          period: item.period,
          primaryValue: 0,
          secondaryValue: item.sales,
        });
      }
    }

    return [...dataMap.values()].toSorted((a, b) => {
      return a.period.localeCompare(b.period);
    });
  }, [primarySales, secondarySales]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
  }, [periodFilter]);

  const data = useMemo(() => {
    return rawData
      .toSorted(PeriodSorting.sortByPeriod(periodFilter.period))
      .map(item => {
        const parsed = parsePeriodData(item.period, periodFilter.period);

        return {
          label: parsed.label,
          fullLabel: parsed.label,
          primaryValue: item.primaryValue,
          secondaryValue: item.secondaryValue,
        };
      });
  }, [rawData, periodFilter.period]);

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
            onDelete: periodFilter.onDelete,
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
                className="leading-full text-base font-normal text-[#474B4E]"
                padding={{ left: 55, right: 30 }}
              />
              <YAxis
                domain={chartAxis.domain}
                ticks={chartAxis.ticks}
                axisLine={false}
                tickLine={false}
                hide
                className="leading-full text-base font-normal text-[#474B4E]"
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
                  if (value == null) return null;
                  const label =
                    name === 'primaryValue' ? 'Первичные ' : 'Вторичные ';
                  return [value.toLocaleString('ru-RU'), `${label} продажи`];
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
