import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { type IReferenceItem, ReferenceQueries } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { ReferencesType } from '#/shared/types/references.type';
import { getError } from '#/shared/utils/get-error';

export const useDeleteReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['edit-reference', type, id],
    mutationFn: async () => {
      if (!id) {
        const { toast } = await import('sonner');
        toast.error('Отсутствует id ресурса');
        return null;
      }
      return http.delete(`${type}/${id}`).json<IReferenceItem>();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');

      queryClient.setQueryData(
        ReferenceQueries.queryKeys.getReferences([type]),
        (oldData: IReferenceItem[][]) => {
          if (!oldData) return oldData;

          return oldData.map(innerArray =>
            Array.isArray(innerArray)
              ? innerArray.filter(item => item.id !== id)
              : innerArray
          );
        }
      );

      toast.success('Ресурс успешно удален');
      onClose();
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
