import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

export function useColumnVisibility<T>(
  allColumns: ColumnDef<T>[],
  defaultVisible?: string[]
) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultVisible ??
      allColumns.map(col =>
        String('accessorKey' in col ? col.accessorKey : col.id)
      )
  );

  const columnsForTable = useMemo(
    () =>
      allColumns.filter(col => {
        const id = 'accessorKey' in col ? col.accessorKey : col.id;
        return id !== undefined && visibleColumns.includes(String(id));
      }),
    [allColumns, visibleColumns]
  );

  const columnItems = useMemo(
    () =>
      allColumns.map(col => {
        const id: string | number | symbol | undefined =
          'accessorKey' in col ? col.accessorKey : col.id;
        return {
          value: String(id),
          label: 'header' in col ? (col.header as string) : String(id),
        };
      }),
    [allColumns]
  );

  return { visibleColumns, setVisibleColumns, columnsForTable, columnItems };
}
