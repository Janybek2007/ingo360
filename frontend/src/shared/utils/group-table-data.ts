import type { ColumnDef } from '@tanstack/react-table';

type AggregateType = 'sum' | 'first';

interface GroupTableDataOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  visibleColumns: string[];
  ignore?: string[];
}

const stringifyValue = (value: unknown) => {
  if (value === null) return '__null__';
  if (value === undefined) return '__undefined__';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

const cloneRow = <TData>(row: TData): TData => {
  if (typeof structuredClone === 'function') {
    return structuredClone(row);
  }

  try {
    return JSON.parse(JSON.stringify(row)) as TData;
  } catch {
    return { ...(row as object) } as TData;
  }
};

const getColumnId = <TData>(column: ColumnDef<TData>): string | null => {
  if (column.id) return String(column.id);
  if (column.accessorKey) return String(column.accessorKey);
  return null;
};

const getColumnValue = <TData>(
  row: TData,
  column: ColumnDef<TData>,
  rowIndex: number
): unknown => {
  if (column.meta?.getGroupValue) {
    return column.meta.getGroupValue(row);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (column.accessorFn) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return column.accessorFn(row, rowIndex);
  }

  if (column.accessorKey) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (row as Record<string, unknown>)[column.accessorKey];
  }

  if (column.id) {
    return (row as Record<string, unknown>)[column.id];
  }

  return undefined;
};

const getNumericValue = <TData>(
  row: TData,
  column: ColumnDef<TData>,
  rowIndex: number
): number | null => {
  const value = getColumnValue(row, column, rowIndex);
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const setColumnValue = <TData>(
  row: TData,
  column: ColumnDef<TData>,
  value: unknown
) => {
  if (column.meta?.setValue) {
    column.meta.setValue(row, value);
    return;
  }

  if (column.accessorKey) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (row as Record<string, unknown>)[column.accessorKey] = value;
    return;
  }

  if (column.id) {
    (row as Record<string, unknown>)[column.id] = value;
  }
};

interface ColumnInfo<TData> {
  id: string;
  aggregate: AggregateType;
  skipGrouping: boolean;
  forceGrouping: boolean;
  column: ColumnDef<TData>;
}

const buildColumnInfo = <TData>(
  column: ColumnDef<TData>
): ColumnInfo<TData> | null => {
  const id = getColumnId(column);
  if (!id) return null;

  const aggregate = column.meta?.aggregate ?? ('first' as AggregateType);
  const skipGrouping = column.meta?.skipGrouping ?? false;
  const forceGrouping = column.meta?.forceGrouping ?? false;

  return {
    id,
    aggregate,
    skipGrouping,
    forceGrouping,
    column,
  };
};

export const groupTableData = <TData>({
  data,
  columns,
  visibleColumns,
  ignore = [],
}: GroupTableDataOptions<TData>): TData[] => {
  if (!Array.isArray(data) || data.length === 0) return data;

  const visibleSet = new Set(visibleColumns.map(String));
  const ignoreSet = new Set(ignore.map(String));

  const columnInfos = columns
    .map(buildColumnInfo)
    .filter(Boolean) as ColumnInfo<TData>[];

  const groupColumns = columnInfos.filter(info => {
    if (info.aggregate === 'sum') return false;
    if (info.skipGrouping) return false;
    if (ignoreSet.has(info.id) && !info.forceGrouping) return false;

    return visibleSet.has(info.id) || ignoreSet.has(info.id);
  });

  // Если группировка невозможна (например, нет видимых колонок),
  // возвращаем исходные данные
  if (groupColumns.length === 0) {
    return data;
  }

  const sumColumns = columnInfos.filter(info => info.aggregate === 'sum');

  if (sumColumns.length === 0) {
    return data;
  }

  const aggregatedMap = new Map<string, TData>();

  data.forEach((row, rowIndex) => {
    const key = groupColumns
      .map(info => stringifyValue(getColumnValue(row, info.column, rowIndex)))
      .join('|');

    const existing = aggregatedMap.get(key);

    if (!existing) {
      aggregatedMap.set(key, cloneRow(row));
      return;
    }

    sumColumns.forEach(info => {
      const nextValue = getNumericValue(row, info.column, rowIndex);
      if (nextValue === null) return;

      const currentValue = getNumericValue(existing, info.column, rowIndex);
      const accumulated = (currentValue ?? 0) + nextValue;

      setColumnValue(existing, info.column, accumulated);
    });
  });

  return Array.from(aggregatedMap.values());
};
