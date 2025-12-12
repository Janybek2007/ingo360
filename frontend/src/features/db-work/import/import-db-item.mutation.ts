import { useMutation } from '@tanstack/react-query';

import { DbQueries } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';

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
    onError: QueryOnError,
  });
};
