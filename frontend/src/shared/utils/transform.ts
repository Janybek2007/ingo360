import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';

import type { IItem } from '#/entities/reference';

import type { SortDirection } from '../types/global';

export function transformData<T extends Record<string, any>>(data: T | null) {
  if (!data) return null;

  const result: Record<string, any> = { ...data };

  for (const [key, value] of Object.entries(data)) {
    if (
      value &&
      typeof value === 'object' &&
      'id' in value &&
      ('name' in value || 'full_name' in value)
    ) {
      result[`${key}_id`] = (value as IItem).id;
    }
  }

  return result;
}

export function transformHeaderKeys<T extends Record<string, any>>(
  columns: ColumnDef<T>[],
  ignores: (keyof T)[] = []
): Record<keyof T, string> {
  return columns.reduce(
    (acc, column) => {
      if (
        typeof column.header === 'string' &&
        column.accessorKey &&
        !ignores?.includes(column.accessorKey as keyof T)
      ) {
        acc[column.accessorKey as keyof T] = column.header;
      }
      return acc;
    },
    {} as Record<keyof T, string>
  );
}

type TFilterPayloadValue = string | number;

export const transformColumnFiltersToPayload = (
  columnFilters: ColumnFiltersState,
  keyMap: Record<string, string> = {}
): Record<string, TFilterPayloadValue> => {
  return columnFilters.reduce<Record<string, TFilterPayloadValue>>(
    (acc, filter) => {
      const mappedKey = keyMap[filter.id] ?? filter.id;

      const rawValue = filter.value;

      if (
        rawValue &&
        typeof rawValue === 'object' &&
        'selectValues' in rawValue &&
        Array.isArray(rawValue.selectValues)
      ) {
        acc[mappedKey] = rawValue.selectValues
          .map(item => item.value)
          .join(',');
        return acc;
      }

      if (
        rawValue &&
        typeof rawValue === 'object' &&
        'value' in rawValue &&
        rawValue.value !== undefined
      ) {
        acc[mappedKey] = rawValue.value as TFilterPayloadValue;
        return acc;
      }

      if (typeof rawValue === 'string' || typeof rawValue === 'number') {
        acc[mappedKey] = rawValue;
      }

      return acc;
    },
    {}
  );
};

export const transformSortingToPayload = (
  sorting: SortingState,
  keyMap: Record<string, string> = {}
): { sort_by?: string; sort_order?: SortDirection } => {
  const first = sorting[0];
  if (!first) return {};

  const sortBy = keyMap[first.id] ?? first.id;

  return {
    sort_by: sortBy,
    sort_order: first.desc ? 'DESC' : 'ASC',
  };
};
