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
import { UsedFilter } from '#/shared/components/used-filter';
import { useKeepQuery } from '#/shared/hooks/use-keep-query';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { useSession } from '#/shared/session';
import { calculateChartAxis } from '#/shared/utils/calculate';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { parsePeriodData } from '#/shared/utils/parse-period-data';
import { PeriodSorting } from '#/shared/utils/period-sorting';

interface DynamicSecondarySalesRaw {
  period: string;
  packages: number;
  sales: number;
}

export const DynamicSecondarySales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const filtersState = useDbFiltersState({
    indicator: { enabled: false },
    rowsCount: { enabled: false },
    search: { enabled: false },
  });

  const filterOptions = useFilterOptions([
    'products/brands',
    'products/product-groups',
  ]);

  const lastYear = useSession(s => s.lastYear);

  const filters = useDbFilters({
    state: filtersState,
    brandsOptions: filterOptions.options.products_brands,
    groupsOptions: filterOptions.options.products_product_groups,
  });
  const periodFilter = usePeriodFilter({
    lastYear: lastYear?.secondary,
  });

  const queryData = useKeepQuery(
    DbQueries.GetDbItemsQuery<DynamicSecondarySalesRaw[]>(
      ['sales/secondary/reports/chart'],
      {
        brand_ids: filtersState.brands,
        product_group_ids: filtersState.groups,

        group_by_period: periodFilter.period,
        period_values: periodFilter.selectedValues,

        enabled: !filterOptions.isLoading,
        method: 'POST',
      }
    )
  );
  const sales = React.useMemo(() => {
    const rawData = queryData.data ? queryData.data[0] : [];
    return rawData
      .toSorted(PeriodSorting.sortByPeriod(periodFilter.period))
      .map(item => {
        const parsed = parsePeriodData(item.period, periodFilter.period);

        return {
          label: parsed.value,
          fullLabel: parsed.label,
          value: item.sales,
        };
      });
  }, [queryData.data, periodFilter.period]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filtersState.resetFilters();
  }, [periodFilter, filtersState]);

  const chartAxis = useMemo(
    () => calculateChartAxis(sales, ['value']),
    [sales]
  );

  return (
    <PageSection
      title={`Динамика вторичных продаж в ${filtersState.indicator === 'amount' ? 'деньгах' : 'упаковках'}`}
      headerEnd={
        <div className="flex items-center gap-4">
          <DbFilters {...filters} {...filtersState} />
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
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
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <div className="space-y-4">
          <div className="font-inter">
            <LineChart
              key={filtersState.indicator}
              width={sectionStyle.width - 48}
              height={500}
              data={sales}
              margin={{ top: 20, right: 16, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="4 4" vertical={false} />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickMargin={20}
                className="leading-full text-base font-normal text-[#474B4E]"
                padding={{ left: 55, right: 30 }}
              />

              <YAxis
                domain={chartAxis.domain}
                ticks={chartAxis.ticks}
                axisLine={false}
                tickLine={false}
                hide
                className="leading-full text-base font-normal text-[#474B4E]"
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
                  return [
                    (value as number).toLocaleString('ru-RU'),
                    'Вторичные продажи',
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
                  formatter={value =>
                    Number(value as number).toLocaleString('ru-RU')
                  }
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
