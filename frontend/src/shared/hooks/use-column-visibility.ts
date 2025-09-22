import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export function useColumnVisibility<T>(
  allColumns: ColumnDef<T>[],
  defaultVisible?: string[],
  ignore: string[] = []
) {
  const initialVisible =
    defaultVisible ??
    allColumns
      .map(col => String('accessorKey' in col ? col.accessorKey : col.id))
      .filter(id => !ignore.includes(id));

  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(initialVisible);

  const columnsForTable = useMemo(
    () =>
      allColumns.filter(col => {
        const id = 'accessorKey' in col ? col.accessorKey : col.id;
        if (!id) return false;
        if (ignore.includes(String(id))) return true;
        return visibleColumns.includes(String(id));
      }),
    [allColumns, visibleColumns, ignore]
  );

  const columnItems = useMemo(
    () =>
      allColumns
        .filter(col => {
          const id = 'accessorKey' in col ? col.accessorKey : col.id;
          return id !== undefined && !ignore.includes(String(id));
        })
        .map(col => {
          const id = 'accessorKey' in col ? col.accessorKey : col.id;
          return {
            value: String(id),
            label: 'header' in col ? (col.header as string) : String(id),
          };
        }),
    [allColumns, ignore]
  );

  return { visibleColumns, setVisibleColumns, columnsForTable, columnItems };
}
