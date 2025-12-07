import { allMonths } from '../constants/months';

export function getPeriodLabel(value: string | number): string {
  const strValue = String(value);
  const parts = strValue.split('-');

  if (!parts[0]) return '';

  const type = parts[0];
  const year = parts[1];
  const period = parts[2];

  switch (type) {
    case 'month':
      if (period && year) {
        const monthIndex = parseInt(period, 10) - 1;
        return `${allMonths[monthIndex] || 'Неизвестный месяц'} ${year}`;
      }
      return `${year || ''}`;

    case 'quarter':
      if (period && year) {
        return `Q${period} ${year}`;
      }
      return `${year || ''}`;

    case 'year':
      return year || '';

    case 'mat':
      if (period && year) {
        const monthIndex = parseInt(period, 10) - 1;
        return `${allMonths[monthIndex] || 'Неизвестный месяц'} ${year}`;
      }
      return `${year || ''}`;

    case 'ytd':
      if (period && year) {
        const monthIndex = parseInt(period, 10) - 1;
        return `${allMonths[monthIndex] || 'Неизвестный месяц'} ${year}`;
      }
      return `${year || ''}`;

    default:
      return strValue;
  }
}
