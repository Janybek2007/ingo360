import { useMutation } from '@tanstack/react-query';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';
import type { DbType } from '#/shared/types/db.type';

export const usePublishMutation = (type: DbType, currentStatus: boolean) => {
  return useMutation({
    mutationKey: ['publish', 'db-work', currentStatus],
    mutationFn: async (ids: number[]) => {
      return http
        .patch(`${type}/publish-unpublished`, {
          json: { ids: [...new Set(ids)] },
        })
        .json<Pick<IDbItem, 'published' | 'id'>[]>();
    },
    onSuccess: async updatedItems => {
      queryClient.setQueriesData(
        {
          predicate: query => {
            const key = query.queryKey;
            return (
              Array.isArray(key) &&
              key[0] === 'get-db-items' &&
              key.includes(type)
            );
          },
        },
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

      toast({
        message: 'Статус публикации обновлён',
        duration: 8000, // 8 seconds
      });
    },
    onError: QueryOnError,
  });
};
