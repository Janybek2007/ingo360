export type IndicatorType = 'amount' | 'packages' | 'share_percent';
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface TImportResponse {
  imported: number;
  skipped: number;
  total: number;
  skipped_records: Array<{
    row: number;
    missing: string[];
  }>;
}
