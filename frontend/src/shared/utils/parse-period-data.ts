import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

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
  if (periodType === 'year') {
    const year = Number(periodString);
    return { year, label: String(year) };
  }

  if (periodType === 'quarter') {
    const [y, q] = periodString.split('-Q').map(Number);
    return { year: y, quarter: q, label: `Q${q}-${String(y).slice(2)}` };
  }

  // month | mat | ytd → "2025-01"
  const [y, m] = periodString.split('-').map(Number);
  return { year: y, month: m, label: `${m}-${String(y).slice(2)}` };
}
