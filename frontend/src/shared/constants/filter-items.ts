import type { NumberFilterValue, StringFilterValue } from '../utils/filter';

export const filterItems = (colType: 'string' | 'number') => {
  if (colType === 'number') {
    return [
      { value: '>', label: 'Больше чем' },
      { value: '>=', label: 'Больше или равно' },
      { value: '<', label: 'Меньше чем' },
      { value: '<=', label: 'Меньше или равно' },
      { value: '=', label: 'Точно равно' },
      { value: 'between', label: 'Между' },
    ] as { value: NumberFilterValue['type']; label: string }[];
  } else if (colType === 'string') {
    return [
      { value: 'contains', label: 'Содержит' },
      { value: 'startsWith', label: 'Начинается с' },
      { value: 'equals', label: 'Точно равно' },
      { value: 'doesNotEqual', label: 'Не равно' },
    ] as { value: StringFilterValue['type']; label: string }[];
  } else {
    return [];
  }
};
