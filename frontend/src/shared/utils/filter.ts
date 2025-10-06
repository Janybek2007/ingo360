// utils/filter.ts
import type { Row } from '@tanstack/react-table';

export type NumberFilterValue =
  | { type: '>'; value: number }
  | { type: '>='; value: number }
  | { type: '<'; value: number }
  | { type: '<='; value: number }
  | { type: '='; value: number }
  | { type: 'between'; value: [number, number] };

export type StringFilterValue =
  | { type: 'contains'; value: string }
  | { type: 'startsWith'; value: string }
  | { type: 'equals'; value: string }
  | { type: 'doesNotEqual'; value: string };

/** Универсальный фильтр для чисел */
export const numberFilter =
  <T>() =>
  (row: Row<T>, columnId: string, filterValue: NumberFilterValue) => {
    const rowValue = Number(row.getValue(columnId));
    const { type, value } = filterValue;

    switch (type) {
      case '>':
        return rowValue > value;
      case '>=':
        return rowValue >= value;
      case '<':
        return rowValue < value;
      case '<=':
        return rowValue <= value;
      case '=':
        return rowValue === value;
      case 'between':
        if (Array.isArray(value) && value.length === 2)
          return rowValue >= value[0] && rowValue <= value[1];
        return true;
      default:
        return true;
    }
  };

/** Универсальный фильтр для строк */
export const stringFilter =
  <T>() =>
  (row: Row<T>, columnId: string, filterValue: StringFilterValue) => {
    const rowValue = String(row.getValue(columnId));
    const { type = 'equals', value } = filterValue;

    switch (type) {
      case 'contains':
        return rowValue.toLowerCase().includes(value.toLowerCase());
      case 'startsWith':
        return rowValue.toLowerCase().startsWith(value.toLowerCase());
      case 'equals':
        return rowValue === value;
      case 'doesNotEqual':
        return rowValue !== value;
      default:
        return true;
    }
  };

/** Универсальный фильтр для select */
export const selectFilter =
  <T, VT extends string | number>() =>
  (row: Row<T>, columnId: string, filterValue: VT[]) => {
    if (!filterValue || filterValue.length === 0) return true;
    const rowValue = row.getValue<VT>(columnId);
    return filterValue.some(fv => String(fv) === String(rowValue));
  };
