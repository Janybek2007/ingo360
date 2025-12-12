import { useMutation } from '@tanstack/react-query';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { QueryOnError } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';

import { updateDbCache } from '../utils';

export const useDeleteDbItemMutation = (
  type: DbType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['delet-db-item', type, id],
    mutationFn: async () => {
      if (!id) {
        const { toast } = await import('sonner');
        toast.error('Отсутствует id ресурса');
        return null;
      }
      return http.delete(`${type}/${id}`).json<IDbItem>();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');

      updateDbCache(type, (data, { urls }) => {
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
