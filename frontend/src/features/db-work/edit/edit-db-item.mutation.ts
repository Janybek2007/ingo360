import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { DbQueries, type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';
import { getError } from '#/shared/utils/get-error';

export const useEditDbItemMutation = (
  type: DbType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['edit-db-item', type, id],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (parsedBody: any) => {
      if (!id) {
        const { toast } = await import('sonner');
        toast.error('Отсутствует id ресурса');
        return null;
      }
      return http
        .patch(`${type}/${id}`, {
          body: JSON.stringify(parsedBody),
        })
        .json<IDbItem>();
    },
    onSuccess: async updatedItem => {
      if (!updatedItem) return;

      const { toast } = await import('sonner');
      queryClient.setQueryData(
        DbQueries.queryKeys.getDbItems([type]),
        (oldData: IDbItem[][]) => {
          if (!oldData) return [[updatedItem]];
          const updated = [...oldData];
          updated[0] = (updated[0] || []).map(item =>
            item.id === updatedItem.id ? updatedItem : item
          );
          return updated;
        }
      );

      onClose();
      toast.success('Ресурс успешно редактрован');
    },
    onError: async (error: HTTPError) => {
      const { toast } = await import('sonner');
      try {
        const data = await getError(error.response);
        toast.error(data);
      } catch (e) {
        console.error('Ошибка разбора ответа', e);
      }
    },
  });
};
