import { MonthFull } from '#/shared/constants/months';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

export const getMonthName = (month: number): string => {
  const monthNames = Object.values(MonthFull);
  return monthNames[month - 1] || `${month}`;
};

type RawDataItem = {
  year: number;
  month: number;
  quarter: number;
  [key: string]: number;
};

type ProcessedDataItem = {
  label: string;
  fullLabel: string;
  [key: string]: string | number;
};

type ProcessPeriodDataOptions = {
  rawData: RawDataItem[];
  period: UsePeriodType;
  selectedValues: string[];
  aggregateFields?: string[];
};

export function processPeriodData({
  rawData,
  period,
  selectedValues,
  aggregateFields = [],
}: ProcessPeriodDataOptions): ProcessedDataItem[] {
  let filteredData = rawData;

  if (selectedValues.length > 0) {
    filteredData = rawData.filter(item => {
      if (period === 'year') {
        return selectedValues.includes(`${item.year}`);
      } else if (period === 'month') {
        return selectedValues.includes(`month-${item.year}-${item.month}`);
      } else if (period === 'quarter') {
        return selectedValues.includes(`quarter-${item.year}-${item.quarter}`);
      }
      return true;
    });
  }

  if (period === 'month') {
    const sorted = filteredData.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return sorted.map(item => ({
      ...item,
      label: `${getMonthName(item.month).substring(0, 3)}-${item.year.toString().slice(-2)}`,
      fullLabel: `${getMonthName(item.month)} ${item.year}`,
    }));
  }

  if (period === 'year') {
    const years = filteredData.reduce(
      (acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = {
            year: item.year,
            count: 0,
          };
          aggregateFields.forEach(field => {
            acc[item.year][field] = 0;
          });
        }

        aggregateFields.forEach(field => {
          acc[item.year][field] += item[field] || 0;
        });
        acc[item.year].count += 1;

        return acc;
      },
      {} as Record<number, Record<string, number>>
    );

    return Object.values(years)
      .sort((a, b) => a.year - b.year)
      .map(item => {
        const result: ProcessedDataItem = {
          year: item.year,
          label: `${item.year}`,
          fullLabel: `${item.year}`,
        };

        aggregateFields.forEach(field => {
          result[field] = Math.round(item[field] / item.count);
        });

        return result;
      });
  }

  // quarter
  const quarters = filteredData.reduce(
    (acc, item) => {
      const key = `${item.year}-${item.quarter}`;
      if (!acc[key]) {
        acc[key] = {
          year: item.year,
          quarter: item.quarter,
          count: 0,
        };
        aggregateFields.forEach(field => {
          acc[key][field] = 0;
        });
      }

      aggregateFields.forEach(field => {
        acc[key][field] += item[field] || 0;
      });
      acc[key].count += 1;

      return acc;
    },
    {} as Record<string, Record<string, number>>
  );

  return Object.values(quarters)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.quarter - b.quarter;
    })
    .map(item => {
      const result: ProcessedDataItem = {
        year: item.year,
        quarter: item.quarter,
        label: `${item.quarter}кв-${item.year.toString().slice(-2)}`,
        fullLabel: `${item.quarter}кв ${item.year}`,
      };

      aggregateFields.forEach(field => {
        result[field] = Math.round(item[field] / item.count);
      });

      return result;
    });
}
