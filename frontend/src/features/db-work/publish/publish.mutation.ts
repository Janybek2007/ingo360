import { useMutation } from '@tanstack/react-query';

import { type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient, QueryOnError } from '#/shared/libs/react-query';
import { toast } from '#/shared/libs/toast/toasts';
import type { DbType } from '#/shared/types/db.type';
import type { PaginationResponse } from '#/shared/types/global';

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
        (oldData: PaginationResponse<IDbItem[]>[] | undefined) => {
          if (!oldData) return oldData;

          return updateOldData(oldData, updatedItems);
        }
      );

      toast({ message: 'Статус публикации обновлён' });
    },
    onError: QueryOnError,
  });
};

function updateOldData(
  oldData: PaginationResponse<IDbItem[]>[],
  updatedItems: Pick<IDbItem, 'id' | 'published'>[]
): PaginationResponse<IDbItem[]>[] {
  return oldData.map(page => ({
    ...page,
    result: page.result.map(item => updateItem(item, updatedItems)),
  }));
}

function updateItem(
  item: IDbItem,
  updatedItems: Pick<IDbItem, 'id' | 'published'>[]
): IDbItem {
  const updated = updatedItems.find(u => u.id === item.id);
  if (updated) {
    return { ...item, published: updated.published };
  }
  return item;
}
