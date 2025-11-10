import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import type { ReferencesType } from '#/shared/types/references.type';
import { getResponseError } from '#/shared/utils/get-error';

import { updateReferencesCache } from '../utils';

export const useAddReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction
) => {
  return useMutation({
    mutationKey: ['add-reference', type],

    mutationFn: async (parsedBody: any) => {
      return http
        .post(`${type}`, {
          json: parsedBody,
        })
        .json<IReferenceItem>();
    },
    onSuccess: async newItem => {
      const { toast } = await import('sonner');

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
