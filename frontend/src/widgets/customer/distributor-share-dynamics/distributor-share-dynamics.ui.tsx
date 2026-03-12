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
  useDbFiltersState,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { useSession } from '#/shared/session';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getFilterItems } from '#/shared/utils/get-used-items';
import { parsePeriodData } from '#/shared/utils/parse-period-data';
import { stringToColor } from '#/shared/utils/string-to-color';

type DistributorChartItem = {
  period: string;
  totalAmount: number;
  _original: Record<string, number>;
  _topKey: string;
  [key: `dist_${number}`]: number;
};

type DistributorShareChartResponse = {
  data: DistributorChartItem[];
  distributors: Record<string, string>;
};

export const DistributorShareDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const filtersState = useDbFiltersState({
    indicator: { enabled: false },
    rowsCount: { enabled: false },
    search: { enabled: false },
  });

  const filterOptions = useFilterOptions(
    ['products/brands', 'products/product-groups'],
    'sales_primary'
  );

  const lastYear = useSession(s => s.lastYear);

  const filters = useDbFilters({
    state: filtersState,
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
  });

  const periodFilter = usePeriodFilter({ lastYear: lastYear?.primary });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<DistributorShareChartResponse>(
      ['sales/primary/reports/distributor-shares/chart'],
      {
        brand_ids: filtersState.brands,
        product_group_ids: filtersState.groups,
        group_by_dimensions: ['distributor'],
        group_by_period: periodFilter.period,
        period_values: periodFilter.selectedValues,

        enabled: !filterOptions.isLoading,
        method: 'POST',
      }
    )
  );

  const { chartData, distributorKeys, legends } = React.useMemo(() => {
    const { data = [], distributors = {} } = queryData.data?.[0] ?? {};

    const chartData = data.map(item => {
      const parsed = parsePeriodData(item.period, periodFilter.period);
      return {
        ...item,
        label: parsed.value,
        fullLabel: parsed.label,
        year: parsed.year,
      };
    });

    const distributorKeys = Object.keys(chartData[0] ?? {}).filter(k =>
      k.startsWith('dist_')
    );

    const legends = distributorKeys.map(key => ({
      key,
      label: distributors[key] ?? key,
      fill: stringToColor(distributors[key] ?? key),
    }));

    return { chartData, distributorKeys, legends };
  }, [queryData.data, periodFilter.period]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filtersState.resetFilters();
  }, [periodFilter, filtersState]);

  return (
    <PageSection
      legends={legends}
      title="Динамика долей дистрибьюторов в первичных продажах"
      headerEnd={
        <div className="flex items-center gap-4">
          <DbFilters {...filters} {...filtersState} />
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
            usedPeriodFilters={getFilterItems([
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
              margin={{ top: 24 }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <ReferenceLine y={0} stroke="#000" />
              <XAxis
                axisLine={false}
                tickLine={false}
                dataKey="label"
                className="leading-full text-xs font-normal"
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
                formatter={(value, name, properties) => {
                  const dataKey =
                    typeof properties?.dataKey === 'string'
                      ? properties.dataKey
                      : undefined;
                  const originalValue =
                    dataKey != null && properties?.payload?._original
                      ? (
                          properties.payload._original as Record<
                            string,
                            unknown
                          >
                        )[dataKey]
                      : undefined;
                  const displayValue =
                    originalValue === undefined ? value : originalValue;

                  if (displayValue === 0 || displayValue === null) {
                    return null;
                  }

                  const numberValue = Number(displayValue);
                  const formattedValue =
                    Math.abs(numberValue) < 0.01 && numberValue !== 0
                      ? numberValue.toFixed(3)
                      : Math.trunc(numberValue * 100) / 100;
                  return [`${formattedValue}%`, name];
                }}
              />

              {distributorKeys.map((distributionKey, index) => {
                const distributionId = Number.parseInt(
                  distributionKey.replace('dist_', '')
                );
                const legend = legends[index];

                return (
                  <Bar
                    key={distributionKey}
                    dataKey={distributionKey}
                    barSize={periodFilter.period === 'month' ? 40 : 60}
                    stackId="stack"
                    fill={legend?.fill || '#999'}
                    name={legend?.label || `Дистрибьютор ${distributionId}`}
                  >
                    <LabelList
                      dataKey={distributionKey}
                      content={properties => (
                        <SegmentLabel
                          {...properties}
                          distKey={distributionKey}
                          chartData={chartData}
                        />
                      )}
                    />
                    <LabelList
                      dataKey={distributionKey}
                      position="top"
                      offset={8}
                      content={properties => (
                        <TotalAmountLabel
                          {...properties}
                          distKey={distributionKey}
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

    const dataPoint = chartData?.[index];
    const originalValue = dataPoint?._original?.[distKey];
    const displayValue = originalValue === undefined ? value : originalValue;

    const formattedValue =
      Math.abs(displayValue) < 10
        ? displayValue.toFixed(1)
        : Math.round(displayValue);

    const fontSize = getFontSize(height);
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

type TotalAmountLabelProps = {
  chartData: Array<{ totalAmount?: number; _topKey?: string }>;
  x?: number | string;
  y?: number | string;
  width?: number | string;
  index?: number;
  distKey?: string;
};

const TotalAmountLabel: React.FC<TotalAmountLabelProps> = React.memo(
  ({ chartData, x = 0, y = 0, width = 0, index, distKey }) => {
    if (!chartData?.length || index == null) return null;

    const dataPoint = chartData[index];
    if (!dataPoint || (distKey && dataPoint._topKey !== distKey)) {
      return null;
    }
    const totalAmount = dataPoint?.totalAmount;
    if (totalAmount == null || Number.isNaN(totalAmount)) return null;

    const formattedValue = Number(totalAmount).toLocaleString('ru-RU');
    return (
      <text
        x={+x + +width / 2}
        y={+y + -8}
        fill="#111827"
        fontSize={11}
        fontWeight={600}
        textAnchor="middle"
      >
        {formattedValue}
      </text>
    );
  }
);

SegmentLabel.displayName = '_SegmentLabel_';
TotalAmountLabel.displayName = '_TotalAmountLabel_';
DistributorShareDynamics.displayName = '_DistributorShareDynamics_';

const getFontSize = (height: number): number => {
  if (height < 15) return 9;
  if (height < 25) return 10;
  if (height < 35) return 11;
  return 12;
};
