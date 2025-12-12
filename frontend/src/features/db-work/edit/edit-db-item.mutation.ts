import { useMutation } from '@tanstack/react-query';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';

import { matchesDbOptions, updateDbCache } from '../utils';

export const useEditDbItemMutation = (
  type: DbType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['edit-db-item', type, id],

    mutationFn: async (parsedBody: any) => {
      if (!id) {
        const { toast } = await import('sonner');
        toast.error('Отсутствует id ресурса');
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

      const { toast } = await import('sonner');

      updateDbCache(type, (data, { urls, options }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        if (!matchesDbOptions(updatedItem, options)) {
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
      toast.success('Ресурс успешно редактрован');
    },
    onError: QueryOnError,
  });
};
