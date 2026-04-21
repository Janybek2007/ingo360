import { useMutation } from '@tanstack/react-query';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { toast } from '#/shared/libs/toast/toasts';
import type { ReferencesType } from '#/shared/types/references.type';
import { getChangedFields } from '#/shared/utils/get-changed-fields';

import { updateReferencesCache } from '../utils';

export const useEditReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction,
  reference: Record<string, any> | null
) => {
  const id = reference?.id;

  return useMutation({
    mutationKey: ['edit-reference', type, id],

    mutationFn: async (parsedBody: Partial<IReferenceItem>) => {
      if (!id) {
        toast({ message: 'Отсутствует id ресурса', type: 'warning' });
        return null;
      }

      const changedFields = getChangedFields(reference, parsedBody);

      if (Object.keys(changedFields).length === 0) {
        toast({ message: 'Нет изменений', type: 'warning' });
        return null;
      }

      return http
        .patch(`${type}/${id}`, { json: changedFields })
        .json<IReferenceItem>();
    },
    onSuccess: async updatedItem => {
      if (!updatedItem) return;

      updateReferencesCache(type, (data, { urls }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        data[targetIndex] = (data[targetIndex] || []).map(item =>
          item.id === updatedItem.id ? updatedItem : item
        );

        return data;
      });

      onClose();
      toast({ message: 'Ресурс успешно отредактирован' });
    },
  });
};
