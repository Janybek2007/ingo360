import { useMutation } from '@tanstack/react-query';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import type { ReferencesType } from '#/shared/types/references.type';

import { updateReferencesCache } from '../utils';

export const useDeleteReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['delete-reference', type, id],
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

      updateReferencesCache(type, (data, { urls }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        data[targetIndex] = (data[targetIndex] || []).filter(
          item => item.id !== id
        );

        return data;
      });

      toast.success('Ресурс успешно удален');
      onClose();
    },
    onError: QueryOnError,
  });
};
