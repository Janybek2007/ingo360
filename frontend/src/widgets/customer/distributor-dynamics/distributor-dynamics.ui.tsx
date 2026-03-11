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
import {
  DbFilters,
  useDbFilters,
  useDbFiltersState,
  useFilterOptions,
} from '#/shared/components/db-filters';
import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { useSession } from '#/shared/session';
import { calculateChartAxis } from '#/shared/utils/calculate';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getFilterItems } from '#/shared/utils/get-used-items';
import { parsePeriodData } from '#/shared/utils/parse-period-data';
import { stringToColor } from '#/shared/utils/string-to-color';

const formatMoney = (value: number) => value.toLocaleString('ru-RU');

export const DistributorDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const lastYear = useSession(s => s.lastYear);

  const filtersState = useDbFiltersState({
    indicator: { enabled: false },
    rowsCount: { enabled: false },
    search: { enabled: false },
  });

  const filterOptions = useFilterOptions(
    ['products/brands', 'products/product-groups', 'clients/distributors'],
    'sales_secondary'
  );

  const filters = useDbFilters({
    state: filtersState,
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
    distributorsOptions: filterOptions.options.clients_distributors,
  });

  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.secondary,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<{
      data: any[];
      distributors: Record<string, string>;
    }>(['sales/secondary/reports/sales-by-distributors/chart'], {
      brand_ids: filtersState.brands,
      product_group_ids: filtersState.groups,
      distributor_ids: filtersState.distributors,
      group_by_period: periodFilter.period,
      period_values: periodFilter.selectedValues,
      enabled: !filterOptions.isLoading,
      method: 'POST',
    })
  );
  console.log(queryData.data);

  const { chartData, distributorsData } = useMemo(() => {
    const { data: rawData = [], distributors: distributorsMap = {} } =
      queryData.data?.[0] ?? {};

    const distributorsData = Object.entries(distributorsMap).map(
      ([id, name]) => ({
        id: Number(id),
        name: name as string,
        color: stringToColor(name as string),
      })
    );

    const allNames = Object.values(distributorsMap) as string[];

    const chartData = rawData.map((item: any) => {
      const parsed = parsePeriodData(item.period, periodFilter.period);
      const point: any = {
        period: item.period,
        label: parsed.value,
        fullLabel: parsed.label,
      };

      for (const name of allNames) {
        point[name] = item[name]?.total_amount ?? null;
      }

      return point;
    });

    return { chartData, distributorsData };
  }, [queryData.data, periodFilter.period]);

  const allDistributorIds = useMemo(
    () => distributorsData.map(d => d.id),
    [distributorsData]
  );

  const [distributors, setDistributors] = React.useState<number[]>([]);

  React.useEffect(() => {
    setDistributors(allDistributorIds);
  }, [allDistributorIds]);

  const filteredChartData = useMemo(() => {
    if (distributors.length === 0) return chartData;
    const activeNames = new Set(
      distributorsData.filter(d => distributors.includes(d.id)).map(d => d.name)
    );
    return chartData.map(item => {
      const filtered: any = {
        period: item.period,
        label: item.label,
        fullLabel: item.fullLabel,
      };
      for (const key of Object.keys(item)) {
        if (activeNames.has(key)) filtered[key] = item[key];
      }
      return filtered;
    });
  }, [chartData, distributors, distributorsData]);

  const chartAxis = useMemo(
    () =>
      calculateChartAxis(
        filteredChartData,
        distributorsData
          .filter(d => distributors.includes(d.id))
          .map(d => d.name)
      ),
    [filteredChartData, distributorsData, distributors]
  );

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filtersState.resetFilters();
    setDistributors(allDistributorIds);
  }, [periodFilter, filtersState, allDistributorIds]);

  return (
    <PageSection
      title="Динамика вторичных продаж по дистрибьюторам (в денежном выражении)"
      legends={distributorsData.map(d => ({ label: d.name, fill: d.color }))}
      headerEnd={
        <div className="flex items-center gap-4">
          <DbFilters {...filters} {...filtersState} />
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
            usedPeriodFilters={getFilterItems([
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
                data={filteredChartData}
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
