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

    // Нормализация для корректной работы с кириллицей
    const normalizeText = (text: string) =>
      text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    switch (type) {
      case 'contains':
        return normalizeText(rowValue).includes(normalizeText(value));
      case 'startsWith':
        return normalizeText(rowValue).startsWith(normalizeText(value));
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
  (
    row: Row<T>,
    columnId: string,
    filterValue: {
      selectValues: { value: VT; label: string }[];
      colType: string;
    }
  ) => {
    if (!filterValue || filterValue.selectValues.length === 0) return true;
    console.log(row.original, columnId);
    const originalData = row.original as Record<
      string,
      { label: string; value: VT; id: number }
    >;
    const rowValue = originalData[columnId];
    return filterValue.selectValues.some(
      fv =>
        String(fv.value) === String(rowValue.value) ||
        String(fv.value) === String(rowValue.id)
    );
  };
