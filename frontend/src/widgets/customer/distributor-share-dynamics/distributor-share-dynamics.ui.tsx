import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
} from 'recharts';

import { DbQueries } from '#/entities/db';
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
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { getMonthName } from '#/shared/utils/process-period-data';
import { stringToColor } from '#/shared/utils/string-to-color';

type DistributorData = {
  distributor_id: number;
  distributor_name: string;
  periods_data: Record<string, { share_percent: number }>;
};

export const DistributorShareDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const filterOptions = useFilterOptions();

  const filters = useDbFilters({
    brandsOptions: filterOptions.brands,
    groupsOptions: filterOptions.groups,
    config: {
      indicator: { enabled: false },
      rowsCount: { enabled: false },
      search: { enabled: false },
    },
  });
  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<DistributorData[]>(
      ['sales/primary/reports/distributor-shares'],
      {
        brand_ids: filters.brands,
        product_group_ids: filters.groups,
      }
    )
  );

  const { chartData, legends, distributorKeys } = React.useMemo(() => {
    if (!queryData.data || !queryData.data[0]) {
      return { chartData: [], legends: [], distributorKeys: [] };
    }

    const rawData = queryData.data[0] as DistributorData[];

    const distributorMap = new Map<number, { name: string; color: string }>();
    rawData.forEach(item => {
      if (!distributorMap.has(item.distributor_id)) {
        distributorMap.set(item.distributor_id, {
          name: item.distributor_name,
          color: stringToColor(item.distributor_name),
        });
      }
    });

    const periodsSet = new Set<string>();
    rawData.forEach(item => {
      Object.keys(item.periods_data).forEach(period => periodsSet.add(period));
    });

    const sortedPeriods = Array.from(periodsSet).sort();

    let filteredPeriods = sortedPeriods;
    if (periodFilter.selectedValues.length > 0) {
      filteredPeriods = sortedPeriods.filter(period => {
        const [year, month] = period.split('-');
        const monthNum = parseInt(month);
        const quarter = Math.ceil(monthNum / 3);

        if (periodFilter.period === 'year') {
          return periodFilter.selectedValues.includes(year);
        } else if (periodFilter.period === 'month') {
          return periodFilter.selectedValues.includes(
            `month-${year}-${monthNum}`
          );
        } else if (periodFilter.period === 'quarter') {
          return periodFilter.selectedValues.includes(
            `quarter-${year}-${quarter}`
          );
        }
        return true;
      });
    }

    const periodDataMap = new Map<string, any>();

    filteredPeriods.forEach(period => {
      const [year, month] = period.split('-');
      const monthNum = parseInt(month);
      const quarter = Math.ceil(monthNum / 3);
      const yearNum = parseInt(year);

      let key = period;
      let label = `${getMonthName(monthNum).substring(0, 3)}-${year.slice(-2)}`;
      let fullLabel = `${getMonthName(monthNum)} ${year}`;

      if (periodFilter.period === 'year') {
        key = year;
        label = year;
        fullLabel = year;
      } else if (periodFilter.period === 'quarter') {
        key = `${year}-Q${quarter}`;
        label = `${quarter}кв-${year.slice(-2)}`;
        fullLabel = `${quarter}кв ${year}`;
      }

      if (!periodDataMap.has(key)) {
        periodDataMap.set(key, {
          period: key,
          label,
          fullLabel,
          year: yearNum,
          month: monthNum,
          quarter,
          counts: new Map(),
        });
      }

      const periodData = periodDataMap.get(key);

      rawData.forEach(item => {
        if (item.periods_data[period]) {
          const distKey = `dist_${item.distributor_id}`;
          const sharePercent = item.periods_data[period].share_percent;

          if (!periodData[distKey]) {
            periodData[distKey] = 0;
            periodData.counts.set(distKey, 0);
          }

          periodData[distKey] += sharePercent;
          periodData.counts.set(distKey, periodData.counts.get(distKey) + 1);
        }
      });
    });

    const processedData = Array.from(periodDataMap.values()).map(item => {
      const result: any = {
        label: item.label,
        fullLabel: item.fullLabel,
        year: item.year,
      };

      if (periodFilter.period === 'quarter') {
        result.quarter = item.quarter;
      }

      distributorMap.forEach((_, distId) => {
        const distKey = `dist_${distId}`;
        if (item[distKey] !== undefined) {
          const count = item.counts.get(distKey) || 1;
          result[distKey] = Math.round((item[distKey] / count) * 100) / 100;
        } else {
          result[distKey] = 0;
        }
      });

      delete result.counts;
      return result;
    });

    processedData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      if (periodFilter.period === 'quarter') {
        return (a.quarter || 0) - (b.quarter || 0);
      }
      return 0;
    });

    const legendsArray = Array.from(distributorMap.entries()).map(
      ([_, info]) => ({
        label: info.name,
        fill: info.color,
      })
    );

    const distKeys = Array.from(distributorMap.keys()).map(id => `dist_${id}`);

    return {
      chartData: processedData,
      legends: legendsArray,
      distributorKeys: distKeys,
    };
  }, [queryData.data, periodFilter.period, periodFilter.selectedValues]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filters.resetFilters();
  }, [periodFilter, filters]);

  return (
    <PageSection
      legends={legends}
      title="Динамика долей дистрибьюторов в первичных продажах"
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
            isView={filters.usedFilterItems.length > 0}
          />

          <div className="font-inter">
            <BarChart
              width={sectionStyle.width - 48}
              height={500}
              data={chartData}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey="label"
                className="font-normal text-xs leading-full"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                labelStyle={{
                  color: '#111827',
                  fontWeight: 600,
                  marginBottom: '8px',
                  fontSize: '13px',
                }}
                itemStyle={{
                  color: '#374151',
                  padding: '4px 0',
                  fontSize: '12px',
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullLabel || label;
                  }
                  return label;
                }}
                formatter={(value: number, name: string) => {
                  const formattedValue =
                    Math.abs(value) < 0.01 && value !== 0
                      ? value.toFixed(3)
                      : Math.round(value * 100) / 100;
                  return [`${formattedValue}%`, name];
                }}
              />

              {distributorKeys.map((distKey, index) => {
                const distId = parseInt(distKey.replace('dist_', ''));
                const legend = legends[index];

                return (
                  <Bar
                    key={distKey}
                    dataKey={distKey}
                    barSize={periodFilter.period === 'month' ? 40 : 60}
                    stackId="a"
                    fill={legend?.fill || '#999'}
                    name={legend?.label || `Дистрибьютор ${distId}`}
                  >
                    <LabelList dataKey={distKey} content={<SegmentLabel />} />
                  </Bar>
                );
              })}
            </BarChart>
          </div>
        </div>
      </AsyncBoundary>
    </PageSection>
  );
});

const SegmentLabel: React.FC<any> = React.memo(
  ({ x, y, width, height, value }) => {
    if (!value || value === 0) return null;

    return (
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        fill="#fff"
        fontSize={12}
        textAnchor="middle"
      >
        {Math.round(value * 100) / 100}%
      </text>
    );
  }
);

SegmentLabel.displayName = '_SegmentLabel_';
DistributorShareDynamics.displayName = '_DistributorShareDynamics_';
