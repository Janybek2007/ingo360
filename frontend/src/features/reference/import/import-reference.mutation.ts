import { useMutation } from '@tanstack/react-query';

import { ReferenceQueries } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toastImportResponse } from '#/shared/libs/toast/toast-import-response';
import type { TImportResponse } from '#/shared/types/global';
import type { ReferencesType } from '#/shared/types/references.type';

export const useImportReferenceMutation = (type: ReferencesType) => {
  return useMutation({
    mutationKey: ['import-reference', type],
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
        queryKey: ReferenceQueries.queryKeys.getReferences([type]),
      });

      toastImportResponse({
        response,
        fileName: file.name,
      });
    },
    onError: QueryOnError,
  });
};
