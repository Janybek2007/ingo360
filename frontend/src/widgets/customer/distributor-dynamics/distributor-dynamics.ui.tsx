import { useQuery } from '@tanstack/react-query';
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
import { Select } from '#/shared/components/ui/select';
import {
  type IUsedFilterItem,
  UsedFilter,
} from '#/shared/components/used-filter';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUniqueItems } from '#/shared/utils/get-unique-items';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { processPeriodData } from '#/shared/utils/process-period-data';

const DISTRIBUTOR_COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#17becf',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#d62728',
];

const formatMoney = (value: number) => formatCompactNumber(value);

interface DistributorDynamicsData extends TDbItem {
  total_amount: number;
  total_packages: number;
}

export const DistributorDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const periodFilter = usePeriodFilter();

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<DistributorDynamicsData[]>([
      'sales/secondary/reports/sales-by-distributors',
    ])
  );
  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);
  const [distributors, setDistributors] = React.useState<number[]>([]);

  const distributorsData = React.useMemo(() => {
    const uniqueDistributors = getUniqueItems(
      sales.map(item => ({
        value: item.distributor_id,
        label: item.distributor_name,
      })),
      ['value']
    );

    return uniqueDistributors.map((dist, index) => ({
      id: dist.value,
      name: dist.label,
      color: DISTRIBUTOR_COLORS[index % DISTRIBUTOR_COLORS.length],
    }));
  }, [sales]);

  React.useEffect(() => {
    if (distributors.length === 0 && distributorsData.length > 0) {
      setDistributors(distributorsData.map(d => d.id));
    }
  }, [distributorsData, distributors.length]);

  const availableOptions = React.useMemo(() => {
    const brands = sales.map(item => ({
      value: item.brand_id,
      label: item.brand_name,
    }));

    const groups = sales.map(item => ({
      value: item.product_group_id,
      label: item.product_group_name,
    }));

    return {
      brands: getUniqueItems(brands, ['value']),
      groups: getUniqueItems(groups, ['value']),
    };
  }, [sales]);

  const rawData = React.useMemo(() => {
    let filtered = sales;

    if (brands.length > 0) {
      filtered = filtered.filter(item => brands.includes(item.brand_id));
    }

    if (groups.length > 0) {
      filtered = filtered.filter(item =>
        groups.includes(item.product_group_id)
      );
    }

    if (distributors.length > 0) {
      filtered = filtered.filter(item =>
        distributors.includes(item.distributor_id)
      );
    }

    const dataMap = new Map<
      string,
      Record<string, number> & {
        year: number;
        month: number;
        quarter: number;
      }
    >();

    filtered.forEach(item => {
      const key = `${item.year}-${item.month}`;
      const distributorName = item.distributor_name;

      if (!dataMap.has(key)) {
        dataMap.set(key, {
          year: item.year,
          month: item.month,
          quarter: item.quarter,
        });
      }

      const existing = dataMap.get(key)!;
      const currentValue = (existing[distributorName] as number) || 0;
      existing[distributorName] = currentValue + item.total_amount;
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [brands, distributors, groups, sales]);

  const chartData = useMemo(() => {
    const distributorNames = distributorsData
      .filter(d => distributors.includes(d.id))
      .map(d => d.name);

    return processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: distributorNames,
    });
  }, [
    periodFilter.period,
    periodFilter.selectedValues,
    rawData,
    distributorsData,
    distributors,
  ]);

  const usedFilterItems = useMemo((): IUsedFilterItem[] => {
    return [
      ...getUsedFilterItems([
        {
          value: periodFilter.selectedValues,
          getLabelFromValue: getPeriodLabel,
          onDelete: v =>
            periodFilter.onChange(
              periodFilter.selectedValues.filter(x => x !== v)
            ),
        },
        distributors.length > 0 &&
          distributors.length !== distributorsData.length && {
            value: distributors,
            onDelete: () => setDistributors(distributorsData.map(d => d.id)),
            items: distributorsData.map(d => ({ label: d.name, value: d.id })),
            main: {
              onDelete: value =>
                setDistributors(distributors.filter(x => x !== value)),
              label: 'Дистрибьюторы: ',
            },
          },
      ]),
      brands.length > 0 && {
        label: 'Бренды: ',
        value: 'brand-roots',
        onDelete: () => setBrands([]),
        subItems: brands.map(brandId => {
          const brand = availableOptions.brands.find(b => b.value === brandId);
          return {
            label: brand?.label || '',
            value: brandId,
            onDelete: () => {
              setBrands(prev => prev.filter(b => b !== brandId));
            },
          };
        }),
      },
      groups.length > 0 && {
        label: 'Группы: ',
        value: 'group-roots',
        onDelete: () => setGroups([]),
        subItems: groups.map(groupId => {
          const group = availableOptions.groups.find(g => g.value === groupId);
          return {
            label: group?.label || '',
            value: groupId,
            onDelete: () => {
              setGroups(prev => prev.filter(g => g !== groupId));
            },
          };
        }),
      },
    ].filter(Boolean) as IUsedFilterItem[];
  }, [
    periodFilter,
    distributors,
    distributorsData,
    brands,
    groups,
    availableOptions.brands,
    availableOptions.groups,
  ]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    setBrands([]);
    setGroups([]);
    setDistributors(distributorsData.map(d => d.id));
  }, [periodFilter, distributorsData]);

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
      title="Динамика вторичных продаж по дистрам (в деньгах)"
      legends={distributorsData.map(d => ({ label: d.name, fill: d.color }))}
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<true, number>
            value={brands}
            setValue={setBrands}
            showToggleAll
            isMultiple
            checkbox
            items={availableOptions.brands}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem] w-max left-0' }}
          />
          <Select<true, number>
            value={groups}
            isMultiple
            checkbox
            showToggleAll
            setValue={setGroups}
            items={availableOptions.groups}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem] w-max left-0' }}
          />
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
        <div className="space-y-4 relative">
          <UsedFilter
            usedFilterItems={usedFilterItems}
            resetFilters={resetFilters}
          />
          <div className="font-inter">
            {distributors.length === 0 ? (
              <div className="text-center text-gray-500 py-60">
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
                  className="text-[#474B4E] font-normal text-base leading-full"
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  domain={chartAxis.domain}
                  ticks={chartAxis.ticks}
                  axisLine={false}
                  tickLine={false}
                  className="text-[#474B4E] font-normal text-base leading-full"
                  tickMargin={10}
                  tickFormatter={formatMoney}
                />

                <Tooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0)
                      return null;

                    return (
                      <div className="bg-white rounded-md px-3 py-2 shadow-lg border border-gray-200">
                        <div className="text-xs text-gray-500 font-medium mb-2">
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
                                  className="w-2 h-2 rounded-full"
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
                        className="font-inter text-xs hidden"
                        formatter={value => {
                          if (value === undefined || value === null) return '';
                          return formatCompactNumber(value as number);
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
