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
import {
  DbFilters,
  useDbFilters,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { calculateChartAxis } from '#/shared/utils/calc-chart-axis';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { processPeriodData } from '#/shared/utils/process-period-data';

interface OverallVisitRow extends TDbItem {
  year: 2025;
  month: 1;
  total_visits: 4334;
}

export const OverallVisits: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const filterOptions = useFilterOptions({ brands: false });

  const filters = useDbFilters({
    groupsOptions: filterOptions.groups,
    config: {
      brands: { enabled: false },
      rowsCount: { enabled: false },
      indicator: { enabled: false },
    },
  });
  const periodFilter = usePeriodFilter();
  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<OverallVisitRow[]>(
      ['visits/reports/visits-by-month'],
      {
        product_group_ids: filters.groups,
        type_period: periodFilter.period,
        filterValues: periodFilter.selectedValues,
      }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  const usedFilterItems = React.useMemo(() => {
    return [
      ...getUsedFilterItems([
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
      ]),
      ...filters.usedFilterItems,
    ];
  }, [periodFilter, filters.usedFilterItems]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filters.resetFilters();
  }, [periodFilter, filters]);

  const rawData = useMemo(() => {
    const dataMap = new Map<
      string,
      { year: number; month: number; quarter: number; value: number }
    >();

    let filteredVisits = visits;

    filteredVisits.forEach(item => {
      const month = item.month;
      const year = item.year;
      const quarter = Math.ceil(month / 3);
      const key = `${year}-${month}`;

      const existing = dataMap.get(key) || {
        year,
        month,
        quarter,
        value: 0,
      };
      existing.value += item.total_visits;
      dataMap.set(key, existing);
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [visits]);

  const chartData = useMemo(() => {
    return processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: ['value'],
    });
  }, [rawData, periodFilter.period, periodFilter.selectedValues]);

  const chartAxis = useMemo(
    () => calculateChartAxis(chartData, ['value'], 10000),
    [chartData]
  );

  return (
    <PageSection
      title="Визиты"
      headerEnd={
        <div className="flex items-center gap-4">
          <DbFilters {...filters} />
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <div className="space-y-4">
          <UsedFilter
            usedFilterItems={usedFilterItems}
            resetFilters={resetFilters}
            isView={periodFilter.isView}
          />

          <div className="font-inter">
            <LineChart
              width={sectionStyle.width - 48}
              height={500}
              data={chartData}
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
                className="text-base text-[#474B4E] leading-full font-normal"
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
                  return [(value as number).toLocaleString('ru-RU'), 'Визитов'];
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
        </div>
      </AsyncBoundary>
    </PageSection>
  );
});

OverallVisits.displayName = '_OverallVisits_';
