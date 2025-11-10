import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface UsecolumnVisibilityOptions<T> {
  allColumns: ColumnDef<T>[];
  defaultVisible?: string[];
  ignore?: string[];
  setGroupBy?: React.Dispatch<React.SetStateAction<string[]>>;
}

export function useColumnVisibility<T>({
  allColumns,
  defaultVisible,
  ignore = [],
  setGroupBy,
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

    if (prevColumnIdsRef.current === currentIdsString) return;

    prevColumnIdsRef.current = currentIdsString;

    // добавляем новые колонки
    const newColumns = currentIds.filter(id => !visibleColumns.includes(id));
    if (newColumns.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleColumns(prev => [...prev, ...newColumns]);
    }

    // удаляем несуществующие
    const removedColumns = visibleColumns.filter(
      id => !currentIds.includes(id)
    );
    if (removedColumns.length > 0) {
      setVisibleColumns(prev => prev.filter(id => currentIds.includes(id)));
    }
  }, [allColumns, ignore, visibleColumns]);

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
    return allColumns
      .filter(col => {
        const id = 'accessorKey' in col ? col.accessorKey : col.id;
        return id !== undefined && !ignore.includes(String(id));
      })
      .map(col => {
        const id = 'accessorKey' in col ? col.accessorKey : col.id;
        return {
          value: String(id),
          label: 'header' in col ? (col.header as string) : String(id),
          disabled: false,
        };
      });
  }, [allColumns, ignore]);

  const load = useCallback(() => {
    if (setGroupBy == null) return;
    const groupDimensions = getGroupDimensions(
      allColumns,
      visibleColumns,
      ignore
    );
    setGroupBy(prev =>
      prev.length === groupDimensions.length &&
      prev.every((value, index) => value === groupDimensions[index])
        ? prev
        : groupDimensions
    );
  }, [allColumns, ignore, setGroupBy, visibleColumns]);

  const setColumns = useCallback(
    (value: React.SetStateAction<string[]>) => {
      load();
      setVisibleColumns(value);
    },
    [load]
  );

  return {
    visibleColumns,
    setVisibleColumns: setColumns,
    columnsForTable,
    columnItems,
  };
}

function getGroupDimensions(
  columns: ColumnDef<any>[],
  visibleColumnIds: string[],
  ignore: string[] = []
): string[] {
  return columns.reduce<string[]>((acc, column) => {
    const id =
      'accessorKey' in column && column.accessorKey
        ? String(column.accessorKey)
        : column.id != null
          ? String(column.id)
          : '';

    if (!id || ignore.includes(id)) return acc;
    if (!visibleColumnIds.includes(id)) return acc;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const dimension = column.meta?.groupDimension;
    if (dimension && !acc.includes(dimension)) {
      acc.push(dimension);
    }

    return acc;
  }, []);
}
