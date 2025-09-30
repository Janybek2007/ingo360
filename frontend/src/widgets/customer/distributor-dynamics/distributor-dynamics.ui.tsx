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
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { allMonths } from '#/shared/constants/months';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
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
  const chartData = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const obj: Record<string, number | string> = { month: i + 1 };
      distributorsData.forEach(d => {
        if (!obj[d.name]) obj[d.name] = getRandomValues()[i];
      });
      return obj;
    });
  }, []);

  return (
    <PageSection
      title="Динамика вторичных продаж по дистрам (в сравнении)"
      legends={distributorsData.map(d => ({ label: d.name, fill: d.color }))}
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<true, string>
            value={['brand', 'group', 'distributor']}
            setValue={() => {}}
            checkbox
            items={[
              { value: 'brand', label: 'Бренд' },
              { value: 'group', label: 'Группа' },
              { value: 'distributor', label: 'Дистр' },
            ]}
            triggerText="Бренд/Группа/Дистр"
          />{' '}
          <Select<true, number>
            triggerText={'Год'}
            items={[2024, 2025].map(y => ({ label: String(y), value: y }))}
            value={[2024]}
            checkbox
            setValue={() => {}}
            rightIcon={<Icon name="lucide:chevron-down" size={18} />}
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
              menu: 'w-full right-0',
            }}
          />
          <Select<true, string>
            triggerText={'Месяц'}
            items={allMonths.map(m => ({ label: String(m), value: m }))}
            value={allMonths as unknown as string[]}
            checkbox
            setValue={() => {}}
            rightIcon={<Icon name="lucide:chevron-down" size={18} />}
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
              menu: 'w-[140px] right-0',
            }}
          />
          <Select<true, number>
            triggerText={'Квартал'}
            items={[1, 2, 3, 4].map(q => ({
              label: `Квартал ${q}`,
              value: q,
            }))}
            value={[1, 2]}
            checkbox
            setValue={() => {}}
            rightIcon={<Icon name="lucide:chevron-down" size={18} />}
            classNames={{
              trigger: 'gap-4 rounded-full min-w-[120px] justify-between',
              menu: 'w-[160px] right-0',
            }}
          />
        </div>
      }
    >
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
    </PageSection>
  );
});

DistributorDynamics.displayName = '_DistributorDynamics_';
