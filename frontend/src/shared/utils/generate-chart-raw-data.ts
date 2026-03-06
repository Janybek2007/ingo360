import type { TDbItem } from '#/entities/db';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

import { parsePeriodData } from './parse-period-data';
import { PeriodSorting } from './period-sorting';

interface ChartRawDataPoint {
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

  for (const item of items) {
    if (!item.periods_data || typeof item.periods_data !== 'object') continue;

    const groupKey = groupBy ? groupBy(item) : null;
    const sortedEntries = Object.entries(item.periods_data).toSorted(
      PeriodSorting.sortByPeriodsData(config.periodType)
    );

    for (const [periodKey, periodValue] of sortedEntries) {
      const value = (periodValue as any)?.[valueField];
      if (value == null) continue;

      const { label } = parsePeriodData(periodKey, periodType);

      if (groupKey) {
        upsertGroupedPoint(dataMap, periodKey, label, groupKey, value);
      } else {
        upsertDataPoint(dataMap, periodKey, label, outputField, value);
      }
    }
  }

  return sortChartRawData([...dataMap.values()]);
}

function createDataPoint(
  periodKey: string,
  label: string,
  field: string,
  value: number
): ChartRawDataPoint {
  return { period: periodKey, label, fullLabel: label, [field]: value };
}

function updateGroupedPoint(
  existing: ChartRawDataPoint,
  groupKey: string,
  value: number
): void {
  existing[groupKey] = ((existing[groupKey] as number) || 0) + value;
}

function updateSimplePoint(
  existing: ChartRawDataPoint,
  outputField: string,
  value: number
): void {
  existing[outputField] = (existing[outputField] as number) + value;
}

function upsertDataPoint(
  dataMap: Map<string, ChartRawDataPoint>,
  periodKey: string,
  label: string,
  field: string,
  value: number
): void {
  const existing = dataMap.get(periodKey);
  if (existing) {
    updateSimplePoint(existing, field, value);
  } else {
    dataMap.set(periodKey, createDataPoint(periodKey, label, field, value));
  }
}

function upsertGroupedPoint(
  dataMap: Map<string, ChartRawDataPoint>,
  periodKey: string,
  label: string,
  groupKey: string,
  value: number
): void {
  const existing = dataMap.get(periodKey);
  if (existing) {
    updateGroupedPoint(existing, groupKey, value);
  } else {
    dataMap.set(periodKey, createDataPoint(periodKey, label, groupKey, value));
  }
}

function sortChartRawData(data: ChartRawDataPoint[]): ChartRawDataPoint[] {
  return data.toSorted((a, b) => a.period.localeCompare(b.period));
}
