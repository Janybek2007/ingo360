import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { ReportLogsQueries } from '#/entities/report-logs';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';
import { getResponseError } from '#/shared/utils/get-error';

export const useDeleteReportLogMutation = (callback: VoidFunction) => {
  return useMutation({
    mutationKey: ['delete-report-log'],
    mutationFn: async (reportLogId: number) => {
      return http.delete(`import_logs/${reportLogId}`).json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ReportLogsQueries.queryKeys.getReportLogs,
      });

      callback();
      toast({ message: 'Лог отчета будет удален в ближайшее время' });
    },
    onError: async (error: HTTPError) => {
      try {
        const data = await getResponseError(error.response);
        toast({
          message: 'Ошибка при удалении лога отчета',
          description: data || 'Неизвестная ошибка',
          type: 'error',
        });
      } catch (error_) {
        console.error('Ошибка разбора ответа', error_);
        toast({
          message: 'Ошибка при удалении лога отчета',
          type: 'error',
        });
      }
    },
  });
};
