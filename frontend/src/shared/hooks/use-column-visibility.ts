import type { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

export interface UsecolumnVisibilityOptions<T> {
  allColumns: ColumnDef<T>[];
  defaultVisible?: string[];
  ignore: string[];
}

export function useColumnVisibility<T>({
  allColumns,
  defaultVisible,
  ignore,
}: UsecolumnVisibilityOptions<T>) {
  const getInitialVisible = () =>
    defaultVisible ??
    allColumns
      .map(col => String('accessorKey' in col ? col.accessorKey : col.id))
      .filter(id => !ignore.includes(id));

  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(getInitialVisible);

  useEffect(() => {
    const nextVisible = getInitialVisible();

    if (JSON.stringify(nextVisible) !== JSON.stringify(visibleColumns)) {
      setVisibleColumns(nextVisible);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allColumns, defaultVisible, ignore]);

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
