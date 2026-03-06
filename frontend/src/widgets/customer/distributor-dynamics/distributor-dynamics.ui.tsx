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
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { calculateChartAxis } from '#/shared/utils/calculate';
import { generateChartRawData } from '#/shared/utils/generate-chart-raw-data';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { stringToColor } from '#/shared/utils/string-to-color';

const formatMoney = (value: number) => value.toLocaleString('ru-RU');

export const DistributorDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
    'clients/distributors',
  ]);

  const filters = useDbFilters({
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    distributorsOptions: filterOptions.options.clients_distributors,
    config: {
      indicator: { enabled: false },
      rowsCount: { enabled: false },
      search: { enabled: false },
    },
  });
  const periodFilter = usePeriodFilter();

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<TDbItem[]>(
      ['sales/secondary/reports/sales-by-distributors/chart'],
      {
        brand_ids: filters.brands,
        product_group_ids: filters.groups,
        distributor_ids: filters.distributors,
        group_by_period: periodFilter.period,
        period_values: periodFilter.selectedValues,

        enabled: !filterOptions.isLoading,
        method: 'POST',
      }
    )
  );
  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const [distributors, setDistributors] = React.useState<number[]>([]);

  const distributorsData = React.useMemo(() => {
    const uniqueDistributors = getUniqueItems(
      sales.map(item => ({
        value: item.distributor_id,
        label: item.distributor_name,
      })),
      ['value']
    ).filter(v => Boolean(v.value));

    return uniqueDistributors.map(distribution => ({
      id: distribution.value,
      name: distribution.label,
      color: stringToColor(distribution.label),
    }));
  }, [sales]);

  React.useEffect(() => {
    if (distributors.length === 0 && distributorsData.length > 0) {
      setDistributors(distributorsData.map(d => d.id));
    }
  }, [distributorsData, distributors.length]);

  const chartData = useMemo(() => {
    let filtered = sales;

    if (distributors.length > 0) {
      filtered = filtered.filter(item =>
        distributors.includes(item.distributor_id)
      );
    }

    const rawData = generateChartRawData(filtered, {
      valueField: 'total_amount',
      groupBy: item => item.distributor_name,
      periodType: periodFilter.period,
    });

    return rawData;
  }, [periodFilter.period, sales, distributors]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filters.resetFilters();
    setDistributors([]);
  }, [periodFilter, filters]);

  const chartAxis = useMemo(
    () =>
      calculateChartAxis(
        chartData,
        distributorsData
          .filter(d => distributors.includes(d.id))
          .map(d => d.name)
      ),
    [chartData, distributorsData, distributors]
  );

  return (
    <PageSection
      title="Динамика вторичных продаж по дистрибьюторам (в денежном выражении)"
      legends={distributorsData.map(d => ({ label: d.name, fill: d.color }))}
      headerEnd={
        <div className="flex items-center gap-4">
          <DbFilters {...filters} />
          <Select<true, number>
            value={distributors}
            setValue={setDistributors}
            checkbox
            isMultiple
            showToggleAll
            items={distributorsData.map(d => ({
              value: d.id,
              label: d.name,
            }))}
            triggerText="Дистрибьютор"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <div className="relative space-y-4">
          <UsedFilter
            usedFilterItems={filters.usedFilterItems}
            resetFilters={resetFilters}
            usedPeriodFilters={getUsedFilterItems([
              {
                value: periodFilter.selectedValues,
                getLabelFromValue: getPeriodLabel,
                onDelete: periodFilter.onDelete,
              },
              distributors.length > 0 &&
                distributors.length !== distributorsData.length && {
                  value: distributors,
                  onDelete: () =>
                    setDistributors(distributorsData.map(d => d.id)),
                  items: distributorsData.map(d => ({
                    label: d.name,
                    value: d.id,
                  })),
                  main: {
                    onDelete: value =>
                      setDistributors(distributors.filter(x => x !== value)),
                    label: 'Дистрибьюторы: ',
                  },
                },
            ])}
            isViewPeriods={periodFilter.isView}
            isView={filters.usedFilterItems.length > 0}
          />
          <div className="font-inter">
            {distributors.length === 0 ? (
              <div className="py-60 text-center text-gray-500">
                Дистрибьюторы не выбраны
              </div>
            ) : (
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
                  className="leading-full text-base font-normal text-[#474B4E]"
                  padding={{ left: 55, right: 20 }}
                />
                <YAxis
                  domain={chartAxis.domain}
                  ticks={chartAxis.ticks}
                  axisLine={false}
                  hide
                  tickLine={false}
                  className="leading-full text-base font-normal text-[#474B4E]"
                  tickMargin={10}
                  tickFormatter={formatMoney}
                />

                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0)
                      return null;

                    return (
                      <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-lg">
                        <div className="mb-2 text-xs font-medium text-gray-500">
                          {label}
                        </div>
                        <div className="space-y-1">
                          {payload
                            .filter(
                              entry =>
                                entry.value !== undefined &&
                                entry.value !== null
                            )
                            .map((entry, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm font-semibold text-gray-800">
                                  {entry.name}:{' '}
                                  {formatMoney(entry.value as number)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  }}
                />

                {distributorsData
                  .filter(d => distributors.includes(d.id))
                  .map(d => (
                    <Line
                      key={d.name}
                      type="linear"
                      dataKey={d.name}
                      name={d.name}
                      stroke={d.color}
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                      dot={{ r: 5, fill: d.color }}
                      connectNulls={false}
                    >
                      <LabelList
                        dataKey={d.name}
                        position="top"
                        className="font-inter hidden text-xs"
                        formatter={value => {
                          if (value === undefined || value === null) return '';
                          return Number(value).toLocaleString('ru-RU');
                        }}
                      />
                    </Line>
                  ))}
              </LineChart>
            )}
          </div>
        </div>
      </AsyncBoundary>
    </PageSection>
  );
});

DistributorDynamics.displayName = '_DistributorDynamics_';
