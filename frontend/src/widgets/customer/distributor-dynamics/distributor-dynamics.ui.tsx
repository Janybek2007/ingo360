import React, { useMemo } from 'react';
import {
  CartesianGrid,
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
import {
  BRANDS,
  DISTRIBUTORS,
  GROUPS,
} from '#/shared/constants/test_constants';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { randomInt } from '#/shared/utils/mock';

const distributorsData = [
  { name: 'Эрай', color: '#156082' },
  { name: 'Неман', color: '#E97132' },
  { name: 'Медсервис', color: '#196B24' },
  { name: 'Бимед', color: '#0F9ED5' },
  { name: 'Эляй', color: '#A02B93' },
];

const getRandomValues = () =>
  Array.from({ length: 12 }, () => randomInt(0, 61));

export const DistributorDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const [brand, setBrand] = React.useState<string>('');
  const [group, setGroup] = React.useState<string>('');
  const [distributor, setDistributor] = React.useState<string>('');
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
      {
        value: distributor,
        items: DISTRIBUTORS,
        onDelete: () => setDistributor(''),
      },
    ]);
  }, [periodFilter, brand, group, distributor]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    setBrand('');
    setGroup('');
    setDistributor('');
  }, [periodFilter]);

  const chartData = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const obj: Record<string, number | string> = {
        month: Object.values(Month)[i],
      };
      distributorsData.forEach(d => {
        if (!obj[d.name]) obj[d.name] = getRandomValues()[i];
      });
      return obj;
    });
  }, []);

  return (
    <PageSection
      title="Динамика вторичных продаж по дистрибьюторам (в сравнении)"
      legends={distributorsData.map(d => ({ label: d.name, fill: d.color }))}
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
          <Select<false, string>
            value={distributor}
            setValue={setDistributor}
            items={[{ value: '', label: 'Все' }, ...DISTRIBUTORS]}
            triggerText="Дистрибьютор"
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
            className="-ml-4"
            width={sectionStyle.width - 48}
            height={500}
            data={chartData}
            margin={{ top: 20, right: 16, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={20}
              className="text-[#474B4E] font-normal text-base leading-full"
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              domain={[0, 60]}
              ticks={[0, 10, 20, 30, 40, 50, 60]}
              axisLine={false}
              tickLine={false}
              className="text-[#474B4E] font-normal text-base leading-full"
              tickMargin={20}
            />

            <Tooltip />

            {distributorsData.map(d => (
              <Line
                key={d.name}
                type="linear"
                dataKey={d.name}
                stroke={d.color}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              ></Line>
            ))}
          </LineChart>
        </div>
      </div>
    </PageSection>
  );
});

DistributorDynamics.displayName = '_DistributorDynamics_';
