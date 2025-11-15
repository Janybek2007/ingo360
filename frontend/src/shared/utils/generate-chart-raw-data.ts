import type { TDbItem } from '#/entities/db';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

import { parsePeriodData } from './parse-period-data';
import { PeriodSorting } from './period-sorting';

export interface ChartRawDataPoint {
  period: string;
  label: string;
  fullLabel: string;
  [key: string]: string | number;
}

interface GenerateRawDataConfig {
  valueField: string;
  outputField?: string;
  groupBy?: (item: TDbItem) => string;
  periodType: UsePeriodType;
}

export function generateChartRawData(
  items: TDbItem[],
  config: GenerateRawDataConfig
): ChartRawDataPoint[] {
  const { valueField, outputField = 'value', groupBy, periodType } = config;
  const dataMap = new Map<string, ChartRawDataPoint>();

  items.forEach(item => {
    if (!item.periods_data || typeof item.periods_data !== 'object') return;

    const groupKey = groupBy ? groupBy(item) : null;

    Object.entries(item.periods_data)
      .sort(PeriodSorting.sortByPeriodsData(config.periodType))
      .forEach(([periodKey, periodValue]) => {
        const value = (periodValue as any)?.[valueField];
        if (value === null || value === undefined) return;

        const parsed = parsePeriodData(periodKey, periodType);
        const existing = dataMap.get(periodKey);

        if (groupKey) {
          if (existing) {
            existing[groupKey] = ((existing[groupKey] as number) || 0) + value;
          } else {
            dataMap.set(periodKey, {
              period: periodKey,
              label: parsed.label,
              fullLabel: parsed.label,
              [groupKey]: value,
            });
          }
        } else {
          if (existing) {
            existing[outputField] = (existing[outputField] as number) + value;
          } else {
            dataMap.set(periodKey, {
              period: periodKey,
              label: parsed.label,
              fullLabel: parsed.label,
              [outputField]: value,
            });
          }
        }
      });
  });

  return sortChartRawData(Array.from(dataMap.values()));
}

export function sortChartRawData(
  data: ChartRawDataPoint[]
): ChartRawDataPoint[] {
  return data.sort((a, b) => {
    return a.period.localeCompare(b.period);
  });
}
