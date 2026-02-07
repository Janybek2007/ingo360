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

type TFilterPrimitive = string | number;
type TFilterPayloadValue = TFilterPrimitive | TFilterPrimitive[];

type TExtraDataMap = Record<string, TFilterPrimitive | TFilterPrimitive[]>;

export const transformColumnFiltersToPayload = (
  columnFilters: ColumnFiltersState,
  keyMap: Record<string, string> = {},
  extraDataMap: TExtraDataMap = {}
): Record<string, TFilterPayloadValue> => {
  const appendExtraDataIfArray = (
    key: string,
    value: TFilterPayloadValue
  ): TFilterPayloadValue => {
    if (!Array.isArray(value)) return value;

    const extraData = extraDataMap[key];
    if (extraData === undefined || extraData === null) return value;

    if (Array.isArray(extraData)) {
      value.push(...extraData);
      return value;
    }

    value.push(extraData);
    return value;
  };

  const payload = columnFilters.reduce<Record<string, TFilterPayloadValue>>(
    (acc, filter) => {
      const mappedKey = keyMap[filter.id] ?? filter.id;

      const rawValue = filter.value;

      if (
        rawValue &&
        typeof rawValue === 'object' &&
        'selectValues' in rawValue &&
        Array.isArray(rawValue.selectValues)
      ) {
        acc[mappedKey] = appendExtraDataIfArray(
          mappedKey,
          rawValue.selectValues.map(item => item.value)
        );
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
        acc[mappedKey] = rawValue as TFilterPayloadValue;
      }

      return acc;
    },
    {}
  );

  Object.entries(extraDataMap).forEach(([key, extraData]) => {
    if (extraData === undefined || extraData === null) return;

    if (!(key in payload)) {
      payload[key] = Array.isArray(extraData) ? [...extraData] : extraData;
      return;
    }

    const currentValue = payload[key];

    if (Array.isArray(currentValue)) {
      if (Array.isArray(extraData)) {
        currentValue.push(...extraData);
      } else {
        currentValue.push(extraData);
      }
    }
  });

  return payload;
};

export const transformSortingToPayload = (
  sorting: SortingState,
  keyMap: Record<string, string> = {}
): { sort_by?: string; sort_order?: SortDirection } => {
  const first = sorting[0];
  if (!first) return {};

  const sortBy = keyMap[first.id] ?? first.id;

  return {
    sort_by: sortBy.replace('_ids', ''),
    sort_order: first.desc ? 'DESC' : 'ASC',
  };
};
