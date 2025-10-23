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
      header?: string;
    }
  ) => {
    if (!filterValue || filterValue.selectValues.length === 0) return true;

    // Получаем значение из строки
    const rowValue = row.getValue(columnId);

    // Если значение пустое или undefined
    if (rowValue === null || rowValue === undefined) return false;

    return filterValue.selectValues.some(fv => {
      // Если значение - объект с полями value/id
      if (
        typeof rowValue === 'object' &&
        rowValue !== null &&
        'value' in rowValue
      ) {
        const objValue = rowValue as { value: VT; id?: number };
        // Проверяем по value с учетом типа
        if (
          typeof fv.value === 'number' &&
          typeof objValue.value === 'number'
        ) {
          return fv.value === objValue.value;
        }
        // Проверяем по id если есть
        if (
          'id' in objValue &&
          typeof objValue.id === 'number' &&
          typeof fv.value === 'number'
        ) {
          return fv.value === objValue.id;
        }
        // Строковое сравнение
        return String(fv.value) === String(objValue.value);
      }

      // Если значение - примитив (строка или число)
      // Сравниваем с учетом типа
      if (typeof fv.value === 'number' && typeof rowValue === 'number') {
        return fv.value === rowValue;
      }
      if (typeof fv.value === 'string' && typeof rowValue === 'string') {
        return fv.value === rowValue;
      }

      // Fallback: строковое сравнение для смешанных типов
      return String(fv.value) === String(rowValue);
    });
  };
