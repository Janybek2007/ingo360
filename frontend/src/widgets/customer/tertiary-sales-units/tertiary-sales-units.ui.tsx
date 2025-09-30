import React from 'react';
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
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { allMonths, Month } from '#/shared/constants/months';
import { useSectionStyle } from '#/shared/hooks/use-section-style';

const data: { month: string; value: number; label: number }[] = [
  { month: Month.JAN, value: 2.8, label: 280000 },
  { month: Month.FEB, value: 3.5, label: 350000 },
  { month: Month.MAR, value: 4.2, label: 420000 },
  { month: Month.APR, value: 3.9, label: 390000 },
  { month: Month.MAY, value: 5.0, label: 500000 },
  { month: Month.JUN, value: 5.8, label: 580000 },
  { month: Month.JUL, value: 4.0, label: 400000 },
  { month: Month.AUG, value: 3.9, label: 390000 },
  { month: Month.SEP, value: 4.5, label: 450000 },
  { month: Month.OCT, value: 6.0, label: 600000 },
  { month: Month.NOV, value: 5.3, label: 530000 },
  { month: Month.DEC, value: 4.2, label: 420000 },
];

export const TertiarySalesUnits: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  return (
    <PageSection
      title="Третичный продажи, уп."
      titleBadge={{ label: '↗ 41.67%', color: '#1CC741' }}
      legends={[{ label: 'Визиты', fill: '#0B5A7C' }]}
      headerEnd={
        <div className="flex items-center gap-4">
          <Select<true, string>
            value={['brand', 'group']}
            setValue={() => {}}
            checkbox
            items={[
              { value: 'brand', label: 'Бренд' },
              { value: 'group', label: 'Группа' },
            ]}
            triggerText="Бренд/Группа"
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
            padding={{ left: 20, right: 20 }}
          />

          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            axisLine={false}
            tickLine={false}
            className="text-base text-[#474B4E] leading-full font-normal"
            tickMargin={20}
          />

          <Tooltip />

          <Line
            type="linear"
            dataKey="value"
            stroke={'#0B5A7C'}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          >
            <LabelList
              dataKey="label"
              position="top"
              className="font-inter text-xs"
            />
          </Line>
        </LineChart>
      </div>
    </PageSection>
  );
});

TertiarySalesUnits.displayName = '_TertiarySalesUnits_';
