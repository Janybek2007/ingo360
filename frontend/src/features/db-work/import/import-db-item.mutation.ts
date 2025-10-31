import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { DbQueries } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';
import { getResponseError } from '#/shared/utils/get-error';

export const useImportDbItemMutation = (type: DbType) => {
  return useMutation({
    mutationKey: ['import-db-item', type],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      return http
        .post(`${type}/import-excel`, {
          body: formData,
          headers: {
            BROWSER_CONTENT: 'true',
          },
        })
        .json();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');

      await queryClient.invalidateQueries({
        queryKey: DbQueries.queryKeys.getDbItems([type]),
      });

      toast.success('Файл успешно импортирован');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getResponseError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
