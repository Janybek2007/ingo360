import type { ReferencesTypeWithMain } from '#/shared/types/references.type';

type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}` | `${K & string}.${NestedKeys<T[K]>}`
        : `${K & string}`;
    }[keyof T]
  : never;

export type ExportFormat<T> = {
  [K in NestedKeys<T>]?: string;
};

export type ExportToExcelUrl = ReferencesTypeWithMain | AllowedExportUrls;

export type ExportToExcelButtonProps<T extends object> = {
  fileName?: string;
  headerMap?: ExportFormat<T | { total: number }>;
  fieldsMap?: Record<string, string>;
  booleanMap?: Record<string, [string, string]>;
  // customMap?: { role: { is_admin: 'administrator'; is_operator: 'operator' } };
  customMap?: Partial<Record<keyof T, Record<string, string>>>;
  isPeriod?: boolean;
  url: ExportToExcelUrl;
};

//
type AllowedExportUrls =
  | '/companies'
  | '/users/clients'
  | '/users/admins-operators'
  | '/import_logs'
  | '/primary/reports/distributor-shares'
  | '/primary/reports/stock-coverages'
  | '/primary/reports/stock-levels'
  | '/primary/reports/sales'
  | '/secondary/reports/sales'
  | '/tertiary/reports/sales'
  | '/tertiary/reports/numeric-distribution'
  | '/tertiary/reports/low-stock-pharmacies'
  | '/ims/reports/table'
  | '/visits/reports/visits-sum-for-period'
  | '/reports/doctors-with-visits-by-specialty'
  | '/sales/primary'
  | '/sales/secondary'
  | '/sales/tertiary'
  | '/visits'
  | '/ims';
