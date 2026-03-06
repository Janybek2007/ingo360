import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

import { allMonths } from '../constants/months';

interface ParsedPeriodData {
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

  switch (periodType) {
    case 'year': {
      // "2023"
      year = Number(periodString);
      label = year.toString();

      break;
    }
    case 'month':
    case 'mat':
    case 'ytd': {
      // "2023-01"
      const parts = periodString.split('-');
      year = Number(parts[0]);
      month = Number(parts[1]);
      label = `${allMonths[month - 1]} ${year}`;

      break;
    }
    case 'quarter': {
      // "2023-Q1"
      const parts = periodString.split('-Q');
      year = Number(parts[0]);
      quarter = Number(parts[1]);
      label = `Q${quarter} ${year}`;

      break;
    }
    default: {
      // Fallback
      year = Number(periodString);
      label = periodString;
    }
  }

  return {
    year,
    month,
    quarter,
    label,
  };
}
