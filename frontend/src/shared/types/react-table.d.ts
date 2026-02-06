import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    aggregate?: 'sum' | 'first';
    skipGrouping?: boolean;
    forceGrouping?: boolean;
    getGroupValue?: (row: TData) => unknown;
    setValue?: (row: TData, value: TValue) => void;
    groupDimension?: string;
  }
  interface ColumnDefBase {
    filterType?: 'string' | 'number' | 'select';
    selectOptions?: { label: string; value: string | number }[];
    accessorKey?: string;
    period?: number;
    pinned?: 'left' | 'right';
  }

  //
  interface ColumnFilter {
    id: string;
    value: import('./table-filters.ts').TableFilterValue;
  }
}
