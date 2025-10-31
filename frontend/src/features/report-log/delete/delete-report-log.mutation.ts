import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { ReportLogsQueries } from '#/entities/report-logs';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getResponseError } from '#/shared/utils/get-error';

export const useDeleteReportLogMutation = () => {
  return useMutation({
    mutationKey: ['delete-report-log'],
    mutationFn: async (reportLogId: number) => {
      return http.delete(`report_logs/${reportLogId}`).json();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');

      await queryClient.invalidateQueries({
        queryKey: ReportLogsQueries.queryKeys.getReportLogs,
      });

      toast.success('Лог отчета успешно удален');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getResponseError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
        toast.error('Ошибка при удалении лога отчета');
      }
    },
  });
};
