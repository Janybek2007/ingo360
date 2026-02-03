import { useMutation } from '@tanstack/react-query';

import { DbQueries } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toastImportResponse } from '#/shared/libs/toast/toast-import-response';
import type { DbType } from '#/shared/types/db.type';
import type { TImportResponse } from '#/shared/types/global';

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
        .json<TImportResponse>();
    },
    onSuccess: async (response, file) => {
      await queryClient.invalidateQueries({
        queryKey: DbQueries.queryKeys.getDbItems([type]),
      });

      toastImportResponse({
        response,
        fileName: file.name,
      });
    },
    onError: QueryOnError,
  });
};
