import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnDefBase<TData, TValue> {
    filterType?: 'string' | 'number' | 'select';
    selectOptions?: { label: string; value: string | number }[];
    accessorKey?: string;
    pinned?: 'left' | 'right';
    meta?: {
      aggregate?: 'sum' | 'first';
      skipGrouping?: boolean;
      forceGrouping?: boolean;
      getGroupValue?: (row: TData) => unknown;
      setValue?: (row: TData, value: TValue) => void;
      groupDimension?: string;
    };
  }
}
