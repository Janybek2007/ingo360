import type { TDbItem } from '#/entities/db';

export interface ChartRawDataPoint {
  year: number;
  month: number;
  quarter: number;
  [key: string]: number;
}

interface GenerateRawDataConfig {
  valueField: string;
  outputField?: string;
  groupBy?: (item: TDbItem) => string;
}

export function generateChartRawData(
  items: TDbItem[],
  config: GenerateRawDataConfig
): ChartRawDataPoint[] {
  const { valueField, outputField = 'value', groupBy } = config;
  const dataMap = new Map<string, ChartRawDataPoint>();

  items.forEach(item => {
    if (!item.periods_data || typeof item.periods_data !== 'object') return;

    const groupKey = groupBy ? groupBy(item) : null;

    Object.entries(item.periods_data).forEach(([periodKey, periodValue]) => {
      const value = (periodValue as any)?.[valueField];
      if (value === null || value === undefined) return;

      const [year, month] = periodKey.split('-').map(Number);
      const quarter = Math.ceil(month / 3);

      const existing = dataMap.get(periodKey);

      if (groupKey) {
        if (existing) {
          existing[groupKey] = (existing[groupKey] || 0) + value;
        } else {
          dataMap.set(periodKey, {
            year,
            month,
            quarter,
            [groupKey]: value,
          });
        }
      } else {
        if (existing) {
          existing[outputField] += value;
        } else {
          dataMap.set(periodKey, {
            year,
            month,
            quarter,
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
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
}
