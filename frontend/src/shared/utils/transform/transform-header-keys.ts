import type { ColumnDef } from '@tanstack/react-table';

export function transformHeaderKeys<T extends Record<string, any>>(
  columns: ColumnDef<T>[],
  ignores: (keyof T | 'actions')[] = ['actions']
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
