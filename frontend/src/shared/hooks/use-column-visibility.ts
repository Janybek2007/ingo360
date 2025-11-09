import type { ColumnDef } from '@tanstack/react-table';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const extractColumnId = <T>(column: ColumnDef<T>): string => {
  if ('accessorKey' in column && column.accessorKey) {
    return String(column.accessorKey);
  }
  if (column.id != null) {
    return String(column.id);
  }
  return '';
};

export interface UsecolumnVisibilityOptions<T> {
  allColumns: ColumnDef<T>[];
  defaultVisible?: string[];
  ignore?: string[];
  data?: T[];
}

interface UseColumnVisibilityResult<T> {
  visibleColumns: string[];
  setVisibleColumns: Dispatch<SetStateAction<string[]>>;
  resetVisibleColumns: () => void;
  columnsForTable: ColumnDef<T>[];
  columnItems: Array<{
    value: string;
    label: string;
    disabled: boolean;
  }>;
  processedData: T[];
  groupDimensions: string[];
}

export function useColumnVisibility<T>({
  allColumns,
  defaultVisible,
  ignore = [],
  data,
}: UsecolumnVisibilityOptions<T>): UseColumnVisibilityResult<T> {
  const availableIds = useMemo(
    () =>
      allColumns.map(extractColumnId).filter(id => id && !ignore.includes(id)),
    [allColumns, ignore]
  );

  const defaultIds = useMemo(() => {
    if (defaultVisible && defaultVisible.length > 0) {
      return defaultVisible.filter(id => availableIds.includes(id));
    }
    return availableIds;
  }, [availableIds, defaultVisible]);

  const defaultIdsRef = useRef<string[]>(defaultIds);

  useEffect(() => {
    defaultIdsRef.current = defaultIds;
  }, [defaultIds]);

  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultIds);

  const visibleColumns = useMemo(() => {
    const filtered = selectedColumns.filter(id => availableIds.includes(id));

    const merged = Array.from(new Set([...filtered, ...defaultIds]));

    return merged.length > 0 ? merged : defaultIds;
  }, [selectedColumns, availableIds, defaultIds]);

  const columnsForTable = useMemo(
    () =>
      allColumns.filter(col => {
        const id = extractColumnId(col);
        if (!id) return false;
        if (ignore.includes(id)) return true;
        return visibleColumns.includes(id);
      }),
    [allColumns, visibleColumns, ignore]
  );

  const columnItems = useMemo(() => {
    return allColumns
      .map(column => {
        const id = extractColumnId(column);
        if (!id || ignore.includes(id)) return null;
        return {
          value: id,
          label: 'header' in column ? (column.header as string) : id,
          disabled: false,
        };
      })
      .filter(Boolean) as Array<{
      value: string;
      label: string;
      disabled: boolean;
    }>;
  }, [allColumns, ignore]);

  const processedData = useMemo(() => (data ?? []) as T[], [data]);

  const groupDimensions = useMemo(() => {
    return allColumns.reduce<string[]>((acc, column) => {
      const id = extractColumnId(column);
      if (!id) return acc;
      if (ignore.includes(id)) return acc;
      if (!visibleColumns.includes(id)) return acc;
      const dimension = column.meta?.groupDimension;
      if (dimension && !acc.includes(dimension)) {
        acc.push(dimension);
      }
      return acc;
    }, []);
  }, [allColumns, visibleColumns, ignore]);

  const resetVisibleColumns = useCallback(() => {
    setSelectedColumns(defaultIdsRef.current);
  }, []);

  return {
    visibleColumns,
    setVisibleColumns: setSelectedColumns,
    resetVisibleColumns,
    columnsForTable,
    columnItems,
    processedData,
    groupDimensions,
  };
}
