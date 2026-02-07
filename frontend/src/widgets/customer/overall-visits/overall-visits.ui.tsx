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
import { calculateChartAxis } from '#/shared/utils/calculate';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { parsePeriodData } from '#/shared/utils/parse-period-data';
import { PeriodSorting } from '#/shared/utils/period-sorting';

interface OverallVisitRow extends TDbItem {
  period: string;
  total_visits: 6962;
}

export const OverallVisits: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const filterOptions = useFilterOptions(['products/product-groups']);

  const filters = useDbFilters({
    groupsOptions: filterOptions.options.products_product_groups,
    config: {
      brands: { enabled: false },
      rowsCount: { enabled: false },
      indicator: { enabled: false },
      search: { enabled: false },
    },
  });

  const periodFilter = usePeriodFilter();
  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<OverallVisitRow[]>(
      ['visits/reports/visits-by-period'],
      {
        product_group_ids: filters.groups,
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

  const chartData = useMemo(() => {
    return visits
      .sort(PeriodSorting.sortByPeriod(periodFilter.period))
      .map(item => {
        const parsed = parsePeriodData(item.period, periodFilter.period);

        return {
          label: parsed.label,
          fullLabel: parsed.label,
          value: item.total_visits,
        };
      });
  }, [visits, periodFilter.period]);

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
                padding={{ left: 55, right: 30 }}
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
