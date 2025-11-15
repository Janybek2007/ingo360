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
import { allMonths } from '#/shared/constants/months';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { calculateChartAxis } from '#/shared/utils/calculate';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

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
      search: { enabled: false },
    },
  });
  const periodFilter = usePeriodFilter(['year', 'month'], 'month');
  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<OverallVisitRow[]>(
      ['visits/reports/visits-by-month'],
      {
        product_group_ids: filters.groups,
        filter_values: periodFilter.selectedValues,
        group_by_period: periodFilter.period,
        period_values: periodFilter.selectedValues,
        enabled: !filterOptions.isLoading,
      }
    )
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filters.resetFilters();
  }, [periodFilter, filters]);

  const rawData = useMemo(() => {
    const dataMap = new Map<
      string,
      { year: number; month: number; value: number }
    >();

    visits.forEach(item => {
      const month = item.month;
      const year = item.year;
      const key = `${year}-${month}`;

      const existing = dataMap.get(key) || {
        year,
        month,
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
    if (periodFilter.period === 'year') {
      const yearMap = new Map<number, number>();

      rawData.forEach(item => {
        const current = yearMap.get(item.year) || 0;
        yearMap.set(item.year, current + item.value);
      });

      return Array.from(yearMap.entries())
        .map(([year, value]) => ({
          label: year.toString(),
          fullLabel: year.toString(),
          value,
        }))
        .sort((a, b) => parseInt(a.label) - parseInt(b.label));
    } else {
      return rawData.map(item => ({
        label: `${allMonths[item.month - 1]} ${item.year}`,
        fullLabel: `${allMonths[item.month - 1]} ${item.year}`,
        value: item.value,
      }));
    }
  }, [rawData, periodFilter.period]);

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
            usedFilterItems={filters.usedFilterItems}
            resetFilters={resetFilters}
            isViewPeriods={periodFilter.isView}
            isView={filters.usedFilterItems.length > 0}
            usedPeriodFilters={getUsedFilterItems([
              {
                value: periodFilter.selectedValues,
                getLabelFromValue: getPeriodLabel,
                onDelete: periodFilter.onDelete,
              },
            ])}
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
