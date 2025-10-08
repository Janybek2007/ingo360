import { MonthFull } from '#/shared/constants/months';

export function getPeriodLabel(value: string): string {
  if (value.startsWith('month-')) {
    const [, year, monthIndex] = value.split('-');
    const monthName = Object.values(MonthFull)[parseInt(monthIndex, 10) - 1];
    return `${monthName} ${year}`;
  }

  if (value.startsWith('quarter-')) {
    const [, year, quarter] = value.split('-');
    return `${quarter}кв ${year}`;
  }

  return value;
}
