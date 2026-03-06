import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';

import type { IGetReportLogsResponse } from './report-logs.types';

export const ReportLogsQueries = {
  queryKeys: {
    getReportLogs: ['report-logs'],
  },

  GetReportLogsQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getReportLogs,
      queryFn: () => http.get('import_logs').json<IGetReportLogsResponse>(),
    });
  },
};
