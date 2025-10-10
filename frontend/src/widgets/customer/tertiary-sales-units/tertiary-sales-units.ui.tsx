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

import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { Month } from '#/shared/constants/months';
import { BRANDS, GROUPS } from '#/shared/constants/test_constants';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

const rawData: { month: string; value: number; monthIndex: number }[] = [
  { month: Month.JAN, value: 280000, monthIndex: 0 },
  { month: Month.FEB, value: 350000, monthIndex: 1 },
  { month: Month.MAR, value: 420000, monthIndex: 2 },
  { month: Month.APR, value: 390000, monthIndex: 3 },
  { month: Month.MAY, value: 500000, monthIndex: 4 },
  { month: Month.JUN, value: 580000, monthIndex: 5 },
  { month: Month.JUL, value: 400000, monthIndex: 6 },
  { month: Month.AUG, value: 390000, monthIndex: 7 },
  { month: Month.SEP, value: 450000, monthIndex: 8 },
  { month: Month.OCT, value: 600000, monthIndex: 9 },
  { month: Month.NOV, value: 530000, monthIndex: 10 },
  { month: Month.DEC, value: 420000, monthIndex: 11 },
];

export const TertiarySalesUnits: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const [brand, setBrand] = React.useState<string>('');
  const [group, setGroup] = React.useState<string>('');
  const periodFilter = usePeriodFilter();

  const usedFilterItems = React.useMemo(() => {
    return getUsedFilterItems([
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
      {
        value: brand,
        items: BRANDS,
        onDelete: () => setBrand(''),
      },
      {
        value: group,
        items: GROUPS,
        onDelete: () => setGroup(''),
      },
    ]);
  }, [periodFilter, brand, group]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    setBrand('');
    setGroup('');
  }, [periodFilter]);

  const data = useMemo(() => {
    if (periodFilter.period === 'month') {
      return rawData;
    }

    if (periodFilter.period === 'year') {
      const currentYearTotal = rawData.reduce(
        (sum, item) => sum + item.value,
        0
      );
      return [
        { month: '2021', value: currentYearTotal * 0.7, monthIndex: 0 },
        { month: '2022', value: currentYearTotal * 0.85, monthIndex: 1 },
        { month: '2023', value: currentYearTotal * 0.95, monthIndex: 2 },
        { month: '2024', value: currentYearTotal, monthIndex: 3 },
      ];
    }

    // quarter
    const quarters = [
      { month: 'Q1', value: 0, monthIndex: 0 },
      { month: 'Q2', value: 0, monthIndex: 1 },
      { month: 'Q3', value: 0, monthIndex: 2 },
      { month: 'Q4', value: 0, monthIndex: 3 },
    ];

    rawData.forEach(item => {
      const quarterIndex = Math.floor(item.monthIndex / 3);
      quarters[quarterIndex].value += item.value;
    });

    return quarters;
  }, [periodFilter.period]);

  const chartAxis = useMemo(() => calculateChartAxis(data, ['value']), [data]);

  return (
    <PageSection
      title="Третичный продажи, уп."
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<false, string>
            value={brand}
            setValue={setBrand}
            items={[{ value: '', label: 'Все' }, ...BRANDS]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={group}
            setValue={setGroup}
            items={[{ value: '', label: 'Все' }, ...GROUPS]}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <PeriodFilters {...periodFilter} />
        </div>
      }
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
              dataKey="month"
              axisLine={false}
              tickLine={false}
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
              labelFormatter={label => `${label}`}
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
    </PageSection>
  );
});

TertiarySalesUnits.displayName = '_TertiarySalesUnits_';
