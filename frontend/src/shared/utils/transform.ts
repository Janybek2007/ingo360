import type { ColumnDef } from '@tanstack/react-table';

import type { IItem } from '#/entities/reference';

export function transformData<T extends Record<string, any>>(data: T | null) {
  if (!data) return null;

  const result: Record<string, any> = { ...data };

  for (const [key, value] of Object.entries(data)) {
    if (
      value &&
      typeof value === 'object' &&
      'id' in value &&
      'name' in value
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
