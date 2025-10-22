import { MonthFull } from '#/shared/constants/months';

export function getPeriodLabel(value: string | number): string {
  const parts = String(value).split('-');

  if (parts[0] === 'year') {
    return parts[1];
  }

  if (parts[0] === 'month') {
    const year = parts[1];
    const monthIndex = parseInt(parts[2], 10) - 1;
    const monthName = Object.values(MonthFull)[monthIndex];
    return `${monthName} ${year.slice(-2)}`;
  }

  if (parts[0] === 'quarter') {
    const year = parts[1];
    const quarter = parts[2];
    return `${quarter}кв ${year.slice(-2)}`;
  }

  if (parts[0] === 'mat') {
    const year = parts[1];
    const monthIndex = parseInt(parts[2], 10) - 1;
    const monthName = Object.values(MonthFull)[monthIndex];
    return `${monthName} ${year.slice(-2)}`;
  }

  if (parts[0] === 'ytd') {
    const year = parts[1];
    const monthIndex = parseInt(parts[2], 10) - 1;
    const monthName = Object.values(MonthFull)[monthIndex];
    return `${monthName} ${year.slice(-2)}`;
  }

  return value.toString();
}
