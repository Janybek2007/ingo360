import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
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

import { type DistributorData, processDistributorShareData } from './utils';

export const DistributorShareDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
  ]);

  const filters = useDbFilters({
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    config: {
      indicator: { enabled: false },
      rowsCount: { enabled: false },
      search: { enabled: false },
    },
  });
  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<DistributorData[]>(
      ['sales/primary/reports/distributor-shares/chart'],
      {
        brand_ids: filters.brands,
        product_group_ids: filters.groups,
        group_by_dimensions: ['distributor'],
        group_by_period: periodFilter.period,
        period_values: periodFilter.selectedValues,

        enabled: !filterOptions.isLoading,
        method: 'POST',
      }
    )
  );

  const { chartData, legends, distributorKeys } = React.useMemo(() => {
    const processed = processDistributorShareData(queryData.data?.[0], {
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
    });

    const modifiedChartData = processed.chartData.map(item => {
      const modifiedItem = { ...item };
      const originalValues: Record<string, number> = {};

      processed.distributorKeys.forEach(key => {
        const value = item[key];
        originalValues[key] = value;
        if (value !== undefined && value !== 0) {
          modifiedItem[key] = value > 0 ? value + 70 : value - 70;
        }
      });

      modifiedItem._original = originalValues;
      return modifiedItem;
    });

    return {
      ...processed,
      chartData: modifiedChartData,
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
                onDelete: periodFilter.onDelete,
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
              stackOffset="sign"
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <ReferenceLine y={0} stroke="#000" />
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
                formatter={(value: number, name: string, props: any) => {
                  const dataKey = props.dataKey;
                  const originalValue = props.payload._original?.[dataKey];
                  const displayValue =
                    originalValue !== undefined ? originalValue : value;

                  if (displayValue === 0 || displayValue === undefined) {
                    return null;
                  }

                  const formattedValue =
                    Math.abs(displayValue) < 0.01 && displayValue !== 0
                      ? displayValue.toFixed(3)
                      : Math.round(displayValue * 100) / 100;
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
                    stackId="stack"
                    fill={legend?.fill || '#999'}
                    name={legend?.label || `Дистрибьютор ${distId}`}
                  >
                    <LabelList
                      dataKey={distKey}
                      content={(props: any) => (
                        <SegmentLabel
                          {...props}
                          distKey={distKey}
                          chartData={chartData}
                        />
                      )}
                    />
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
  ({ x, y, width, height, value, distKey, index, chartData }) => {
    if (!value || value === 0) return null;

    // Получаем оригинальное значение из chartData по индексу
    const dataPoint = chartData?.[index];
    const originalValue = dataPoint?._original?.[distKey];
    const displayValue = originalValue !== undefined ? originalValue : value;

    // Форматируем значение компактно
    const formattedValue =
      Math.abs(displayValue) < 10
        ? displayValue.toFixed(1)
        : Math.round(displayValue);

    // Динамический размер шрифта в зависимости от высоты сегмента
    const fontSize = height < 15 ? 9 : height < 25 ? 10 : height < 35 ? 11 : 12;

    return (
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        fill="#fff"
        fontSize={fontSize}
        fontWeight={500}
        textAnchor="middle"
      >
        {formattedValue}%
      </text>
    );
  }
);

SegmentLabel.displayName = '_SegmentLabel_';
DistributorShareDynamics.displayName = '_DistributorShareDynamics_';
