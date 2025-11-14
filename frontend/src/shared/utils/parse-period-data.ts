import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

import { allMonths } from '../constants/months';

export interface ParsedPeriodData {
  year: number;
  month?: number;
  quarter?: number;
  label: string;
}

export function parsePeriodData(
  periodString: string,
  periodType: UsePeriodType
): ParsedPeriodData {
  let year: number;
  let month: number | undefined;
  let quarter: number | undefined;
  let label = '';

  if (periodType === 'year') {
    // "2023"
    year = Number(periodString);
    label = year.toString();
  } else if (
    periodType === 'month' ||
    periodType === 'mat' ||
    periodType === 'ytd'
  ) {
    // "2023-01"
    const parts = periodString.split('-');
    year = Number(parts[0]);
    month = Number(parts[1]);
    label = `${allMonths[month - 1]} ${year}`;
  } else if (periodType === 'quarter') {
    // "2023-Q1"
    const parts = periodString.split('-Q');
    year = Number(parts[0]);
    quarter = Number(parts[1]);
    label = `Q${quarter} ${year}`;
  } else {
    // Fallback
    year = Number(periodString);
    label = periodString;
  }

  return {
    year,
    month,
    quarter,
    label,
  };
}
