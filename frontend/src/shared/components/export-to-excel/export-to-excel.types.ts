export interface ExportToExcelProps<T extends object> {
  data: T[];
  fileName?: string;
}
