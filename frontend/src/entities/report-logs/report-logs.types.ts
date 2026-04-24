export interface ReportLog {
  id: number;
  user_first_name: string | null;
  user_last_name: string | null;
  target_table: string;
  records_count: number;
  imported_count: number | null;
  inserted_count: number | null;
  updated_count: number | null;
  skipped_count: number | null;
  deduplicated_count: number | null;
  created_at: string;
}

export type IGetReportLogsResponse = ReportLog[];
