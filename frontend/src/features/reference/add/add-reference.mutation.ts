import { useMutation } from '@tanstack/react-query';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';
import type { ReferencesType } from '#/shared/types/references.type';

import { updateReferencesCache } from '../utils';

export const useAddReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction
) => {
  return useMutation({
    mutationKey: ['add-reference', type],

    mutationFn: async (parsedBody: any) => {
      return http
        .post(`${type}/create`, {
          json: parsedBody,
        })
        .json<IReferenceItem>();
    },
    onSuccess: async newItem => {
      updateReferencesCache(type, (data, { urls, options }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        const limit =
          typeof options?.limit === 'number' ? options.limit : undefined;

        data[targetIndex] = [newItem, ...(data[targetIndex] ?? [])];

        if (typeof limit === 'number') {
          data[targetIndex] = data[targetIndex].slice(0, limit);
        }

        return data;
      });

      onClose();
      toast({
        message: 'Ресурс успешно добавлен',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
