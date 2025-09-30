import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnDefBase {
    type?: 'string' | 'number' | 'select';
    selectOptions?: { label: string; value: string }[];
    accessorKey?: string;
  }
}
