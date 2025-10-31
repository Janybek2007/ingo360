import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { type IReferenceItem, ReferenceQueries } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { ReferencesType } from '#/shared/types/references.type';
import { getResponseError } from '#/shared/utils/get-error';

export const useAddReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction
) => {
  return useMutation({
    mutationKey: ['add-reference', type],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (parsedBody: any) => {
      return http
        .post(`${type}`, {
          json: parsedBody,
        })
        .json<IReferenceItem>();
    },
    onSuccess: async newItem => {
      const { toast } = await import('sonner');
      queryClient.setQueryData(
        ReferenceQueries.queryKeys.getReferences([type]),
        (oldData: IReferenceItem[][] | undefined) => [
          [newItem, ...(oldData?.[0] ?? [])],
          ...(oldData?.slice(1) ?? []),
        ]
      );

      onClose();
      toast.success('Ресурс успешно добавлен');
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
