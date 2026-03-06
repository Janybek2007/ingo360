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
      case '>': {
        return rowValue > value;
      }
      case '>=': {
        return rowValue >= value;
      }
      case '<': {
        return rowValue < value;
      }
      case '<=': {
        return rowValue <= value;
      }
      case '=': {
        return rowValue === value;
      }
      case 'between': {
        if (Array.isArray(value) && value.length === 2)
          return rowValue >= value[0] && rowValue <= value[1];
        return true;
      }
      default: {
        return true;
      }
    }
  };

// Нормализация для корректной работы с кириллицей
const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '');

/** Универсальный фильтр для строк */
export const stringFilter =
  <T>() =>
  (row: Row<T>, columnId: string, filterValue: StringFilterValue) => {
    const rowValue = String(row.getValue(columnId));
    const { type = 'equals', value } = filterValue;

    switch (type) {
      case 'contains': {
        return normalizeText(rowValue).includes(normalizeText(value));
      }
      case 'startsWith': {
        return normalizeText(rowValue).startsWith(normalizeText(value));
      }
      case 'equals': {
        return rowValue === value;
      }
      case 'doesNotEqual': {
        return rowValue !== value;
      }
      default: {
        return true;
      }
    }
  };

/** Универсальный фильтр для select с поддержкой вложенных путей */
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

    const originalData = row.original as Record<string, any>;

    const path = columnId.split('.');

    const rowValue = path.reduce<any>((accumulator, key) => {
      if (accumulator && typeof accumulator === 'object') {
        return accumulator[key];
      }
    }, originalData);

    const compareValue = rowValue?.value ?? rowValue?.id ?? rowValue;

    return filterValue.selectValues.some(fv => {
      if (fv.value === 0) {
        return (
          compareValue === null ||
          compareValue === undefined ||
          rowValue === null ||
          rowValue === undefined
        );
      }

      return (
        String(fv.value) === String(compareValue) ||
        String(fv.value) === String(rowValue?.id)
      );
    });
  };

/** Универсальный фильтр для boolean (true/false) */
export const booleanFilter =
  <T>() =>
  (
    row: Row<T>,
    columnId: string,
    filterValue: {
      selectValues: { value: 'true' | 'false'; label: string }[];
      colType: string;
    }
  ) => {
    // если фильтр не задан или ничего не выбрано — показываем все строки
    if (!filterValue || filterValue.selectValues.length === 0) return true;

    const rowValue = row.getValue(columnId);

    // нормализуем значение ячейки к boolean
    const normalizedRowValue =
      typeof rowValue === 'boolean'
        ? rowValue
        : String(rowValue).toLowerCase() === 'true';

    // если хотя бы одно выбранное значение совпадает — строка проходит
    return filterValue.selectValues.some(fv => {
      const filterBool = fv.value === 'true';
      return normalizedRowValue === filterBool;
    });
  };
