import { useMutation } from '@tanstack/react-query';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import type { ReferencesType } from '#/shared/types/references.type';

import { updateReferencesCache } from '../utils';

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
        .patch(`${type}/${id}`, { json: parsedBody })
        .json<IReferenceItem>();
    },
    onSuccess: async updatedItem => {
      if (!updatedItem) return;
      const { toast } = await import('sonner');

      updateReferencesCache(type, (data, { urls }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        data[targetIndex] = (data[targetIndex] || []).map(item =>
          item.id === updatedItem.id ? updatedItem : item
        );

        return data;
      });

      onClose();
      toast.success('Ресурс успешно отредактирован');
    },
    onError: QueryOnError,
  });
};
