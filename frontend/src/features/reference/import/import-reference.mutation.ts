import { useMutation } from '@tanstack/react-query';

import { ReferenceQueries } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toast';
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
        .json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ReferenceQueries.queryKeys.getReferences([type]),
      });

      toast({
        message: 'Файл успешно импортирован',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
