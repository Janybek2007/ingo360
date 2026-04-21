import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

import { allMonths } from '../constants/months';

interface ParsedPeriodData {
  year: number;
  month?: number;
  quarter?: number;
  label: string;
  value: string;
}

export function parsePeriodData(
  periodString: string,
  periodType: UsePeriodType
): ParsedPeriodData {
  if (periodType === 'year') {
    const year = Number(periodString);
    return { year, label: String(year), value: String(year) };
  }

  if (periodType === 'quarter') {
    const [y, q] = periodString.split('-Q').map(Number);
    const yy = String(y).slice(2);
    return {
      year: y,
      quarter: q,
      label: `Q${q} ${y}`,
      value: `q${q}-${yy}`,
    };
  }

  // month | mat | ytd → "2025-01"
  const [y, m] = periodString.split('-').map(Number);
  const yy = String(y).slice(2);
  return {
    year: y,
    month: m,
    label: `${allMonths[m - 1]} ${y}`,
    value: `${m}-${yy}`,
  };
}
