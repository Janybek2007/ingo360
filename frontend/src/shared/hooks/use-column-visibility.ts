import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

  const prevColumnIdsRef = useRef<string>('');

  useEffect(() => {
    const currentIds = allColumns
      .map(col => String('accessorKey' in col ? col.accessorKey : col.id))
      .filter(id => !ignore.includes(id));

    const currentIdsString = currentIds.sort().join(',');

    if (prevColumnIdsRef.current === currentIdsString) {
      return;
    }

    prevColumnIdsRef.current = currentIdsString;

    const newColumns = currentIds.filter(id => !visibleColumns.includes(id));
    if (newColumns.length > 0) {
      setVisibleColumns(prev => [...prev, ...newColumns]);
    }

    const removedColumns = visibleColumns.filter(
      id => !currentIds.includes(id)
    );
    if (removedColumns.length > 0) {
      setVisibleColumns(prev => prev.filter(id => currentIds.includes(id)));
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

  const columnItems = useMemo(() => {
    const items = allColumns
      .filter(col => {
        const id = 'accessorKey' in col ? col.accessorKey : col.id;
        return id !== undefined && !ignore.includes(String(id));
      })
      .map(col => {
        const id = 'accessorKey' in col ? col.accessorKey : col.id;
        const isLastVisible =
          visibleColumns.length === 1 && visibleColumns.includes(String(id));
        return {
          value: String(id),
          label: 'header' in col ? (col.header as string) : String(id),
          disabled: isLastVisible,
        };
      });
    return items;
  }, [allColumns, ignore, visibleColumns]);

  const handleSetVisibleColumns = useCallback((newVisible: string[]) => {
    if (newVisible.length === 0) {
      return;
    }
    setVisibleColumns(newVisible);
  }, []);

  return {
    visibleColumns,
    setVisibleColumns: handleSetVisibleColumns,
    columnsForTable,
    columnItems,
  };
}
