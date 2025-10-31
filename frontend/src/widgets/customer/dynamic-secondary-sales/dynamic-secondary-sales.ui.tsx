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

interface SecondarySalesRow extends TDbItem {
  packages: number;
  amount: number;
  total_packages_per_period: number;
  total_amount_per_period: number;
  months: (number | null)[];
}

export const DynamicSecondarySales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const [indicator, setIndicator] = React.useState<'amount' | 'packages'>(
    'amount'
  );
  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);
  const periodFilter = usePeriodFilter();

  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<SecondarySalesRow[]>([
      'sales/secondary/reports/sales',
    ])
  );
  const sales = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData.data]
  );

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

    const dataMap = new Map<
      string,
      { year: number; month: number; quarter: number; value: number }
    >();

    filtered.forEach(item => {
      const key = `${item.year}-${item.month}`;
      const existing = dataMap.get(key);
      const value = item[indicator];

      if (existing) {
        existing.value += value;
      } else {
        dataMap.set(key, {
          year: item.year,
          month: item.month,
          quarter: item.quarter,
          value: value,
        });
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [brands, groups, indicator, sales]);

  const availableOptions = React.useMemo(() => {
    const data = queryData.data ? queryData.data[0] || [] : [];

    const brands = data.map(item => ({
      value: item.brand_id,
      label: item.brand_name,
    }));

    const groups = data.map(item => ({
      value: item.product_group_id,
      label: item.product_group_name,
    }));

    return {
      brands: getUniqueItems(brands, ['value']),
      groups: getUniqueItems(groups, ['value']),
    };
  }, [queryData.data]);

  const usedFilterItems = React.useMemo((): IUsedFilterItem[] => {
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
    availableOptions.brands,
    availableOptions.groups,
    brands,
    groups,
    periodFilter,
  ]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    setBrands([]);
    setGroups([]);
  }, [periodFilter]);

  const data = useMemo(() => {
    return processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: ['value'],
    });
  }, [periodFilter.period, periodFilter.selectedValues, rawData]);

  const chartAxis = useMemo(() => calculateChartAxis(data, ['value']), [data]);

  return (
    <PageSection
      title={`Динамика вторичных продаж в ${indicator === 'amount' ? 'деньгах' : 'упаковках'}`}
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<false, typeof indicator>
            value={indicator}
            setValue={setIndicator}
            items={[
              { value: 'amount', label: 'Деньги' },
              { value: 'packages', label: 'Упаковка' },
            ]}
            triggerText="Деньги/Упаковка"
          />
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
          />

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
                className="text-[#474B4E] font-normal text-base leading-full"
                padding={{ left: 30, right: 30 }}
              />

              <YAxis
                domain={chartAxis.domain}
                ticks={chartAxis.ticks}
                axisLine={false}
                tickLine={false}
                hide
                className="text-[#474B4E] font-normal text-base leading-full"
                tickMargin={20}
                tickFormatter={value => formatCompactNumber(value)}
              />

              <Tooltip
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullLabel || label;
                  }
                  return label;
                }}
                formatter={value => {
                  return [
                    (value as number).toLocaleString('ru-RU'),
                    'Вторичка',
                  ];
                }}
              />

              <Line
                type="linear"
                dataKey="value"
                stroke={'#E97030'}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  className="font-inter text-xs"
                  formatter={value => formatCompactNumber(value as number)}
                />
              </Line>
            </LineChart>
          </div>
        </div>
      </AsyncBoundary>
    </PageSection>
  );
});

DynamicSecondarySales.displayName = '_DynamicSecondarySales_';
