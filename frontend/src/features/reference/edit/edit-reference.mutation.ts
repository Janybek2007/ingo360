import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { type IReferenceItem, ReferenceQueries } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { ReferencesType } from '#/shared/types/references.type';
import { getResponseError } from '#/shared/utils/get-error';

export const useEditReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['edit-reference', type, id],

    mutationFn: async (parsedBody: any) => {
      if (!id) {
        const { toast } = await import('sonner');
        toast.error('Отсутствует id ресурса');
        return null;
      }
      return http
        .patch(`${type}/${id}`, {
          json: parsedBody,
        })
        .json<IReferenceItem>();
    },
    onSuccess: async updatedItem => {
      if (!updatedItem) return;
      const { toast } = await import('sonner');
      queryClient.setQueryData(
        ReferenceQueries.queryKeys.getReferences([type]),
        (oldData: IReferenceItem[][]) => {
          if (!oldData) return [[updatedItem]];
          const updated = [...oldData];
          updated[0] = (updated[0] || []).map(item =>
            item.id === updatedItem.id ? updatedItem : item
          );
          return updated;
        }
      );
      onClose();
      toast.success('Ресурс успешно отредактирован');
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
