import { useMutation } from '@tanstack/react-query';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';
import type { DbType } from '#/shared/types/db.type';

import {
  matchesDbOptions as matchesDatabaseOptions,
  updateDbCache as updateDatabaseCache,
} from '../utils';

export const useEditDbItemMutation = (
  type: DbType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['edit-db-item', type, id],

    mutationFn: async (parsedBody: any) => {
      if (!id) {
        toast({
          message: 'Отсутствует id ресурса',
          type: 'warning',
          duration: 8000, // 8 seconds
        });
        return null;
      }
      return http
        .patch(`${type}/${id}`, {
          json: parsedBody,
        })
        .json<IDbItem>();
    },
    onSuccess: async updatedItem => {
      if (!updatedItem) return;

      updateDatabaseCache(type, (data, { urls, options }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        if (!matchesDatabaseOptions(updatedItem, options)) {
          data[targetIndex] = (data[targetIndex] || []).filter(
            item => item.id !== updatedItem.id
          );
          return data;
        }

        data[targetIndex] = (data[targetIndex] || []).map(item =>
          item.id === updatedItem.id ? updatedItem : item
        );

        return data;
      });

      onClose();
      toast({
        message: 'Ресурс успешно редактрован',
        type: 'success',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
