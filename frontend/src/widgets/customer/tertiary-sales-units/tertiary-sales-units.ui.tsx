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

interface TertiarySalesUnitsRow extends TDbItem {
  packages: number;
  amount: number;
  total_packages_per_period: number;
  total_amount_per_period: number;
  months?: (number | null)[];
}

export const TertiarySalesUnits: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const [brands, setBrands] = React.useState<number[]>([]);
  const [groups, setGroups] = React.useState<number[]>([]);
  const periodFilter = usePeriodFilter();
  const queryData = useQuery(
    DbQueries.GetDbItemsQuery<TertiarySalesUnitsRow[]>([
      'sales/tertiary/reports/sales',
    ])
  );
  const visits = React.useMemo(
    () => (queryData.data ? queryData.data[0] : []),
    [queryData]
  );

  const availableOptions = React.useMemo(() => {
    const brands = visits.map(item => ({
      value: item.brand_id,
      label: item.brand_name,
    }));

    const groups = visits.map(item => ({
      value: item.product_group_id,
      label: item.product_group_name,
    }));

    return {
      brands: getUniqueItems(brands, ['value']),
      groups: getUniqueItems(groups, ['value']),
    };
  }, [visits]);

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

  const rawData = useMemo(() => {
    const dataMap = new Map<
      string,
      {
        year: number;
        month: number;
        quarter: number;
        value: number;
      }
    >();

    let filteredVisits = visits;

    if (brands.length > 0) {
      filteredVisits = filteredVisits.filter(item =>
        brands.includes(item.brand_id)
      );
    }

    if (groups.length > 0) {
      filteredVisits = filteredVisits.filter(item =>
        groups.includes(item.product_group_id)
      );
    }

    filteredVisits.forEach(item => {
      if (!item.months || !Array.isArray(item.months)) return;

      item.months.forEach((value, index) => {
        if (value !== null) {
          const month = index + 1;
          const year = item.year;
          const quarter = Math.ceil(month / 3);
          const key = `${year}-${month}`;

          const existing = dataMap.get(key) || {
            year,
            month,
            quarter,
            value: 0,
          };
          existing.value += value;
          dataMap.set(key, existing);
        }
      });
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
  }, [visits, brands, groups]);

  const proccessedData = useMemo(() => {
    return processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: [],
      aggregateFields: ['value'],
    });
  }, [rawData, periodFilter.period]);

  const chartAxis = useMemo(
    () => calculateChartAxis(proccessedData, ['total_packages_per_period']),
    [proccessedData]
  );
  return (
    <PageSection
      title="Третичные продажи, уп."
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
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        {visits.length <= 10 ? (
          <div>
            <h4>
              Мало данных для отображения графика. Попробуйте изменить фильтры.
            </h4>
          </div>
        ) : (
          <div className="space-y-4">
            <UsedFilter
              usedFilterItems={usedFilterItems}
              resetFilters={resetFilters}
            />

            <div className="font-inter">
              <LineChart
                width={sectionStyle.width - 48}
                height={500}
                data={proccessedData}
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
                  className="text-base font-normal text-[#474B4E] leading-full"
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
                      'Третичные продажи',
                    ];
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
                      return formatCompactNumber(value as number);
                    }}
                  />
                </Line>
              </LineChart>
            </div>
          </div>
        )}
      </AsyncBoundary>
    </PageSection>
  );
});

TertiarySalesUnits.displayName = '_TertiarySalesUnits_';
