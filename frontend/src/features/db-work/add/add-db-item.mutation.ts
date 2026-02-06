import { useMutation } from '@tanstack/react-query';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toast';
import type { DbType } from '#/shared/types/db.type';

import { matchesDbOptions, updateDbCache } from '../utils';

export const useAddReferenceMutation = (
  type: DbType,
  onClose: VoidFunction
) => {
  return useMutation({
    mutationKey: ['add-db-item', type],
    mutationFn: async (parsedBody: any) => {
      return http
        .post(`${type}/create`, {
          json: parsedBody,
        })
        .json<IDbItem>();
    },
    onSuccess: async newItem => {
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
      toast({
        message: 'Ресурс успешно добавлен',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
