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
import { GROUPS } from '#/shared/constants/test_constants';
import { usePeriodFilter } from '#/shared/hooks/use-period-filter';
import { useSectionStyle } from '#/shared/hooks/use-section-style';
import {
  calculateChartAxis,
  formatCompactNumber,
} from '#/shared/utils/format-number';
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
      data.push({
        year,
        month,
        quarter,
        value: Math.floor(Math.random() * 300000) + 280000,
      });
    }
  }

  return data;
};

const rawData = generateRawData();

export const OverallVisits: React.FC = React.memo(() => {
  const sectionStyle = useSectionStyle();
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
      { value: group, items: GROUPS, onDelete: () => setGroup('') },
    ]);
  }, [periodFilter, group]);

  const resetFilters = React.useCallback(() => {
    periodFilter.onReset();
    setGroup('');
  }, [periodFilter]);

  const data = useMemo(() => {
    return processPeriodData({
      rawData,
      period: periodFilter.period,
      selectedValues: periodFilter.selectedValues,
      aggregateFields: ['value'],
    });
  }, [periodFilter.period, periodFilter.selectedValues]);

  const chartAxis = useMemo(() => calculateChartAxis(data, ['value']), [data]);

  return (
    <PageSection
      title="Визиты"
      headerEnd={
        <div className="flex items-center gap-4">
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
              className="text-base text-[#474B4E] leading-full font-normal"
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
                return [(value as number).toLocaleString('ru-RU'), 'Визитов'];
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

OverallVisits.displayName = '_OverallVisits_';
