import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnDefBase {
    filterType?: 'string' | 'number' | 'select';
    selectOptions?: { label: string; value: string | number }[];
    accessorKey?: string;
  }
}
