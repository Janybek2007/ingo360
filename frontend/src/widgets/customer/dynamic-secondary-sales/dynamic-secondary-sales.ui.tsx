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
import { processPeriodData } from '#/shared/utils/process-period-data';

interface DynamicSecondarySalesRaw {
  period: string;
  packages: number;
  sales: number;
}

export const DynamicSecondarySales: React.FC = React.memo(() => {
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
    DbQueries.GetDbItemsQuery<DynamicSecondarySalesRaw[]>(
      ['sales/secondary/reports/chart'],
      { brand_ids: filters.brands, product_group_ids: filters.groups }
    )
  );
  const sales = React.useMemo(() => {
    const data = queryData.data ? queryData.data[0] : [];
    return data.map(item => {
      const [year, month] = item.period.split('-').map(Number);
      const quarter = Math.ceil(month / 3);

      return {
        year,
        month,
        quarter,
        value: item.sales,
      };
    });
  }, [queryData.data]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    filters.resetFilters();
  }, [periodFilter, filters]);

  const data = useMemo(() => {
    return processPeriodData({
      rawData: sales,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: ['value'],
    });
  }, [periodFilter.period, periodFilter.selectedValues, sales]);

  const chartAxis = useMemo(() => calculateChartAxis(data, ['value']), [data]);

  return (
    <PageSection
      title={`Динамика вторичных продаж в ${filters.indicator === 'amount' ? 'деньгах' : 'упаковках'}`}
      headerEnd={
        <div className="flex items-center gap-4">
          <DbFilters {...filters} />
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
      <AsyncBoundary
        isLoading={queryData.isLoading}
        queryError={queryData.error}
      >
        <div className="space-y-4">
          <div className="font-inter">
            <LineChart
              key={filters.indicator}
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
