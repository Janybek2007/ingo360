export interface ReportLog {
  id: number;
  user_first_name: string;
  user_last_name: string;
  target_table: string;
  records_count: number;
  created_at: string;
}

export type IGetReportLogsResponse = ReportLog[];
