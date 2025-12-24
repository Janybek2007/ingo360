import { useMutation } from '@tanstack/react-query';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toast';
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
        toast({
          message: 'Отсутствует id ресурса',
          type: 'warning',
          duration: 8000, // 8 seconds
        });
        return null;
      }
      return http.delete(`${type}/${id}`).json<IReferenceItem>();
    },
    onSuccess: async () => {
      updateReferencesCache(type, (data, { urls }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        data[targetIndex] = (data[targetIndex] || []).filter(
          item => item.id !== id
        );

        return data;
      });

      toast({
        message: 'Ресурс успешно удален',
        duration: 8000, // 8 seconds
      });
      onClose();
    },
    onError: QueryOnError,
  });
};
