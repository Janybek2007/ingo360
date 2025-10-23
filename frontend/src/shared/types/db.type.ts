export type DbType =
  | 'sales/primary'
  | 'sales/secondary'
  | 'sales/tertiary'
  | 'visits';

export type ExtraDbType =
  | DbType
  | 'sales/primary/reports/stock-levels'
  | 'sales/primary/reports/shipments'
  | 'sales/primary/reports/stock-coverages'
  | 'sales/primary/reports/distributor-shares'
  | 'sales/secondary/reports/sales'
  | 'sales/secondary/reports/sales-by-distributors'
  | 'sales/tertiary/reports/sales'
  | 'sales/tertiary/reports/numeric-distribution'
  | 'sales/tertiary/reports/low-stock-pharmacies';
