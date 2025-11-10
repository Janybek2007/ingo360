import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import type { DbType } from '#/shared/types/db.type';
import { getResponseError } from '#/shared/utils/get-error';

import { matchesDbOptions, updateDbCache } from '../utils';

export const useAddReferenceMutation = (
  type: DbType,
  onClose: VoidFunction
) => {
  return useMutation({
    mutationKey: ['add-db-item', type],
    mutationFn: async (parsedBody: any) => {
      return http
        .post(`${type}`, {
          json: parsedBody,
        })
        .json<IDbItem>();
    },
    onSuccess: async newItem => {
      const { toast } = await import('sonner');

      updateDbCache(type, (data, { urls, options }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        if (!matchesDbOptions(newItem, options)) return data;

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
