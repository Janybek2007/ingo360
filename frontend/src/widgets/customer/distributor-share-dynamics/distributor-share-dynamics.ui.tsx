import React from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from 'recharts';

import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { Month } from '#/shared/constants/months';
import { BRANDS, GROUPS } from '#/shared/constants/test_constants';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';

const data = [
  { month: Month.JAN, eray: 20, neman: 5, med: 10, bimed: 15, elay: 20 },
  { month: Month.FEB, eray: 15, neman: 3, med: 8, bimed: 10, elay: 12 },
  { month: Month.MAR, eray: 25, neman: 6, med: 12, bimed: 15, elay: 20 },
  { month: Month.APR, eray: 30, neman: 8, med: 15, bimed: 20, elay: 27 },
  { month: Month.MAY, eray: 28, neman: 6, med: 14, bimed: 18, elay: 22 },
  { month: Month.JUN, eray: 12, neman: 4, med: 6, bimed: 8, elay: 10 },
  { month: Month.JUL, eray: 14, neman: 5, med: 7, bimed: 9, elay: 11 },
  { month: Month.AUG, eray: 22, neman: 7, med: 12, bimed: 14, elay: 18 },
  { month: Month.SEP, eray: 18, neman: 6, med: 10, bimed: 12, elay: 15 },
  { month: Month.OCT, eray: 16, neman: 5, med: 9, bimed: 10, elay: 12 },
  { month: Month.NOV, eray: 24, neman: 7, med: 12, bimed: 16, elay: 22 },
  { month: Month.DEC, eray: 10, neman: 3, med: 6, bimed: 7, elay: 8 },
];

const legends = [
  { label: 'Эрай', fill: '#1f77b4' },
  { label: 'Неман', fill: '#ff7f0e' },
  { label: 'Медсервис', fill: '#2ca02c' },
  { label: 'Бимед', fill: '#17becf' },
  { label: 'Элэй', fill: '#9467bd' },
];

export const DistributorShareDynamics: React.FC = React.memo(() => {
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
      { value: brand, items: BRANDS, onDelete: () => setBrand('') },
      { value: group, items: GROUPS, onDelete: () => setGroup('') },
    ]);
  }, [periodFilter, brand, group]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    setBrand('');
    setGroup('');
  }, [periodFilter]);

  return (
    <PageSection
      legends={legends}
      title="Динамика долей дистров в первичке"
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
          <BarChart width={sectionStyle.width - 48} height={500} data={data}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="month"
              className="font-normal text-xs leading-full"
            />

            <Tooltip
              labelFormatter={label => `${label}`}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />

            <Bar
              dataKey="eray"
              barSize={60}
              stackId="a"
              fill="#1f77b4"
              name="Эрай"
            />
            <Bar dataKey="neman" stackId="a" fill="#ff7f0e" name="Неман" />
            <Bar dataKey="med" stackId="a" fill="#2ca02c" name="Медсервис" />
            <Bar dataKey="bimed" stackId="a" fill="#17becf" name="Бимед" />
            <Bar dataKey="elay" stackId="a" fill="#9467bd" name="Элэй" />
          </BarChart>
        </div>
      </div>
    </PageSection>
  );
});

DistributorShareDynamics.displayName = '_DistributorShareDynamics_';
