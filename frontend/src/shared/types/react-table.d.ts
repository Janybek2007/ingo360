import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnDefBase {
    type?: 'string' | 'number';
  }
}
