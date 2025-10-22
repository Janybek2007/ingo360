import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import { getError } from '#/shared/utils/get-error';

import { LogsQueries } from './logs.queries';

export const useDeleteLogMutation = () => {
  return useMutation({
    mutationKey: ['delete-import-log'],
    mutationFn: async (importId: number) => {
      return http.delete(`import_logs/${importId}`).json();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');

      // Инвалидируем кэш для обновления списка
      await queryClient.invalidateQueries({
        queryKey: LogsQueries.queryKeys.getImportLogs,
      });

      toast.success('Лог импорта успешно удален');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
        toast.error('Ошибка при удалении лога импорта');
      }
    },
  });
};
