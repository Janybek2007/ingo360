// Utilities
export type ReplaceSeparators<T extends string> =
  T extends `${infer A}/${infer B}`
    ? ReplaceSeparators<`${A}_${B}`>
    : T extends `${infer A}-${infer B}`
      ? ReplaceSeparators<`${A}_${B}`>
      : T;

//

export type SortDirection = 'ASC' | 'DESC';
export type IndicatorType = 'amount' | 'packages' | 'share_percent';

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginationResponse<T = any> {
  hasNext: boolean;
  hasPrev: boolean;
  result: T;
  count: number;
}

export interface SortParams {
  sort_order?: SortDirection;
  sort_by?: string;
}

export interface TImportSkippedRecord {
  row: number;
  missing: string[];
}

export interface TImportResponse {
  total: number;
  skipped: number;
  imported: number;
  inserted: number;
  updated: number;
  deduplicated: number;
  skipped_records: TImportSkippedRecord[];
}
