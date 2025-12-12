import { useMutation } from '@tanstack/react-query';

import { DbQueries, type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';

export const usePublishMutation = (type: DbType, currentStatus: boolean) => {
  return useMutation({
    mutationKey: ['publish', 'db-work', currentStatus],
    mutationFn: async (ids: number[]) => {
      return Promise.all(
        ids.map(id =>
          http
            .patch(`${type}/${id}`, {
              json: { published: !currentStatus },
            })
            .json<Pick<IDbItem, 'published' | 'id'>>()
        )
      );
    },
    onSuccess: async updatedItems => {
      const { toast } = await import('sonner');

      queryClient.setQueryData(
        DbQueries.queryKeys.getDbItems([type]),
        (oldData: IDbItem[][] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map(innerArray =>
            innerArray.map(item => {
              const updated = updatedItems.find(u => u.id === item.id);
              return updated ? { ...item, published: updated.published } : item;
            })
          );
        }
      );

      toast.success('Статус публикации обновлён');
    },
    onError: QueryOnError,
  });
};
