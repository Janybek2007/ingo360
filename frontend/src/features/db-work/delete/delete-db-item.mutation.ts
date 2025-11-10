import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import type { DbType } from '#/shared/types/db.type';
import { getResponseError } from '#/shared/utils/get-error';

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
