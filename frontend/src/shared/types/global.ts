export type IndicatorType = 'amount' | 'packages' | 'share_percent';

export interface PaginationParams {
  limit?: number;
  offset?: number;
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
  deduplicated_in_batch: number;
  skipped_records: TImportSkippedRecord[];
}
