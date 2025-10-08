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
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedItems } from '#/shared/utils/get-used-items';

const rawData = [
  { month: Month.JAN, value: 120000, monthIndex: 0 },
  { month: Month.FEB, value: 150000, monthIndex: 1 },
  { month: Month.MAR, value: 135000, monthIndex: 2 },
  { month: Month.APR, value: 160000, monthIndex: 3 },
  { month: Month.MAY, value: 145000, monthIndex: 4 },
  { month: Month.JUN, value: 170000, monthIndex: 5 },
  { month: Month.JUL, value: 155000, monthIndex: 6 },
  { month: Month.AUG, value: 180000, monthIndex: 7 },
  { month: Month.SEP, value: 165000, monthIndex: 8 },
  { month: Month.OCT, value: 190000, monthIndex: 9 },
  { month: Month.NOV, value: 175000, monthIndex: 10 },
  { month: Month.DEC, value: 200000, monthIndex: 11 },
];

export const DynamicSecondarySales: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const [unit, setUnit] = React.useState<'money' | 'packaging'>('money');
  const [brand, setBrand] = React.useState<string>('');
  const [group, setGroup] = React.useState<string>('');
  const periodFilter = usePeriodFilter();

  const usedItems = React.useMemo(() => {
    const brandItems = [
      { value: 'brand1', label: 'Бренд 1' },
      { value: 'brand2', label: 'Бренд 2' },
      { value: 'brand3', label: 'Бренд 3' },
    ];

    const groupItems = [
      { value: 'group1', label: 'Группа 1' },
      { value: 'group2', label: 'Группа 2' },
      { value: 'group3', label: 'Группа 3' },
    ];

    return getUsedItems([
      {
        value: Array.isArray(periodFilter.selectedValues)
          ? periodFilter.selectedValues
          : [],
        getLabelFromValue: getPeriodLabel,
        onDelete: value => {
          const newValues = (
            Array.isArray(periodFilter.selectedValues)
              ? periodFilter.selectedValues
              : []
          ).filter(v => v !== value);
          periodFilter.handleValueChange(newValues);
        },
      },
      {
        value: brand,
        items: brandItems,
        onDelete: () => setBrand(''),
      },
      {
        value: group,
        items: groupItems,
        onDelete: () => setGroup(''),
      },
    ]);
  }, [periodFilter, brand, group]);

  const resetFilters = React.useCallback(() => {
    periodFilter.handleValueChange([]);
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
      title={`Динамика вторичных продаж в ${unit === 'money' ? 'деньгах' : 'упаковках'}`}
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<false, typeof unit>
            value={unit}
            setValue={setUnit}
            items={[
              { value: 'money', label: 'Деньги' },
              { value: 'packaging', label: 'Упаковка' },
            ]}
            triggerText="Деньги/Упаковка"
          />
          <Select<false, string>
            value={brand}
            setValue={setBrand}
            items={[
              { value: '', label: 'Все' },
              { value: 'brand1', label: 'Бренд 1' },
              { value: 'brand2', label: 'Бренд 2' },
              { value: 'brand3', label: 'Бренд 3' },
            ]}
            triggerText="Бренд"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <Select<false, string>
            value={group}
            setValue={setGroup}
            items={[
              { value: '', label: 'Все' },
              { value: 'group1', label: 'Группа 1' },
              { value: 'group2', label: 'Группа 2' },
              { value: 'group3', label: 'Группа 3' },
            ]}
            triggerText="Группа"
            classNames={{ menu: 'w-[10rem]' }}
          />
          <PeriodFilters {...periodFilter} />
        </div>
      }
    >
      <div className="space-y-4">
        <UsedFilter usedItems={usedItems} resetFilters={resetFilters} />

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
              labelFormatter={label => `${label}`}
              formatter={value => {
                return [(value as number).toLocaleString('ru-RU'), 'Вторичка'];
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
    </PageSection>
  );
});

DynamicSecondarySales.displayName = '_DynamicSecondarySales_';
