import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';

import type { ImportLog } from './logs.types';

export class LogsQueries {
  static queryKeys = {
    getImportLogs: ['import-logs'],
  };

  static GetImportLogsQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getImportLogs,
      queryFn: () => http.get('import_logs').json<ImportLog[]>(),
    });
  }
}
