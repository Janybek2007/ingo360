import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Tooltip,
  XAxis,
} from 'recharts';

import { PageSection } from '#/shared/components/page-section';
import { PeriodFilters } from '#/shared/components/period-filters';
import { Select } from '#/shared/components/ui/select';
import { UsedFilter } from '#/shared/components/used-filter';
import { BRANDS, GROUPS } from '#/shared/constants/test_constants';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import { getPeriodLabel } from '#/shared/utils/get-period-label';
import { getUsedFilterItems } from '#/shared/utils/get-used-items';
import { processPeriodData } from '#/shared/utils/process-period-data';

const generateRawData = () => {
  const currentYear = new Date().getFullYear();
  const data = [];

  for (let yearOffset = 1; yearOffset >= 0; yearOffset--) {
    const year = currentYear - yearOffset;
    for (let month = 1; month <= 12; month++) {
      const quarter = Math.ceil(month / 3);
      const eray = Math.floor(Math.random() * 15) + 15;
      const neman = Math.floor(Math.random() * 5) + 3;
      const med = Math.floor(Math.random() * 8) + 6;
      const bimed = Math.floor(Math.random() * 10) + 10;
      const elay = Math.floor(Math.random() * 15) + 10;

      data.push({
        year,
        month,
        quarter,
        eray,
        neman,
        med,
        bimed,
        elay,
        totalAll: eray + neman + med + bimed + elay,
        total: 10,
      });
    }
  }

  return data;
};

const rawData = generateRawData();

const legends = [
  { label: 'Всего', fill: '#6c757d' },
  { label: 'Эрай', fill: '#1f77b4' },
  { label: 'Неман', fill: '#ff7f0e' },
  { label: 'Медсервис', fill: '#2ca02c' },
  { label: 'Бимед', fill: '#17becf' },
  { label: 'Аптека', fill: '#9467bd' },
];

export const DistributorShareDynamics: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
  const [brand, setBrand] = React.useState<string>('');
  const [group, setGroup] = React.useState<string>('');
  const periodFilter = usePeriodFilter();

  const data = React.useMemo(() => {
    return processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: [
        'eray',
        'neman',
        'med',
        'bimed',
        'elay',
        'total',
        'totalAll',
      ],
    });
  }, [periodFilter.period, periodFilter.selectedValues]);

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
      title="Динамика долей дистрибьюторов в первичке"
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

        <div className="fontp-inter">
          <BarChart width={sectionStyle.width - 48} height={500} data={data}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="label"
              className="font-normal text-xs leading-full"
            />

            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullLabel || label;
                }
                return label;
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />

            <Bar
              dataKey="eray"
              barSize={periodFilter.period === 'month' ? 40 : 60}
              stackId="a"
              fill="#1f77b4"
              name="Эрай"
            >
              <LabelList dataKey="eray" content={<SegmentLabel />} />
            </Bar>
            <Bar dataKey="neman" stackId="a" fill="#ff7f0e" name="Неман">
              <LabelList dataKey="neman" content={<SegmentLabel />} />
            </Bar>
            <Bar dataKey="med" stackId="a" fill="#2ca02c" name="Медсервис">
              <LabelList dataKey="med" content={<SegmentLabel />} />
            </Bar>
            <Bar dataKey="bimed" stackId="a" fill="#17becf" name="Бимед">
              <LabelList dataKey="bimed" content={<SegmentLabel />} />
            </Bar>
            <Bar dataKey="elay" stackId="a" fill="#9467bd" name="Элэй">
              <LabelList dataKey="elay" content={<SegmentLabel />} />
            </Bar>
            <Bar dataKey="total" stackId="a" fill="#6c757d" name="Всего">
              <LabelList content={<TotalLabel />} />
            </Bar>
          </BarChart>
        </div>
      </div>
    </PageSection>
  );
});

const SegmentLabel: React.FC<any> = React.memo(
  ({ x, y, width, height, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        fill="#fff"
        fontSize={12}
        textAnchor="middle"
      >
        {value}%
      </text>
    );
  }
);

const TotalLabel: React.FC<any> = React.memo(
  ({ x, y, width, height, value, payload }) => {
    const totalAll = payload?.totalAll || value;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        fill="#fff"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
      >
        {totalAll}
      </text>
    );
  }
);

SegmentLabel.displayName = '_SegmentLabel_';
TotalLabel.displayName = '_TotalLabel_';
DistributorShareDynamics.displayName = '_DistributorShareDynamics_';
