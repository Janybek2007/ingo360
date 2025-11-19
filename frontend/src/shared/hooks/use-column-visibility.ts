import type { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface UsecolumnVisibilityOptions<T> {
  allColumns: ColumnDef<T>[];
  defaultVisible?: string[];
  ignore?: string[];
  setGroupBy?: React.Dispatch<React.SetStateAction<string[]>>;
  allowedGroupDimensions?: string[];
  setPeriods?: React.Dispatch<React.SetStateAction<string[]>>;
}

export function useColumnVisibility<T>({
  allColumns,
  defaultVisible,
  ignore = [],
  setGroupBy,
  setPeriods,
  allowedGroupDimensions,
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

  useEffect(() => {
    if (setGroupBy == null) return;
    const groupDimensions = getGroupDimensions(
      allColumns,
      visibleColumns,
      ignore
    );
    const filteredDimensions =
      allowedGroupDimensions && allowedGroupDimensions.length > 0
        ? groupDimensions.filter(dimension =>
            allowedGroupDimensions.includes(dimension)
          )
        : groupDimensions;
    setGroupBy(prev =>
      arraysAreEqual(prev, filteredDimensions) ? prev : filteredDimensions
    );
  }, [allColumns, ignore, setGroupBy, visibleColumns, allowedGroupDimensions]);

  const setColumns = useCallback(
    (value: React.SetStateAction<string[]>) => {
      setVisibleColumns(prev => {
        const newColumns = typeof value === 'function' ? value(prev) : value;

        if (setPeriods) {
          const periodColumns = newColumns.filter(id =>
            /^\d{4}-\d{2}$/.test(id)
          );

          if (periodColumns.length > 0) {
            const periodHeaders = allColumns
              .filter(col => {
                const id = 'accessorKey' in col ? col.accessorKey : col.id;
                return id && periodColumns.includes(String(id));
              })
              .map(col => ('header' in col ? String(col.header) : ''))
              .filter(Boolean);

            setPeriods(periodHeaders);
          } else {
            setPeriods([]);
          }
        }

        return newColumns;
      });
    },
    [setPeriods, allColumns]
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

function arraysAreEqual<T>(a: T[], b: T[]) {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}
