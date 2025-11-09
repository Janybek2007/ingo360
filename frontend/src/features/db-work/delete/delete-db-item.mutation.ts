import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { type IDbItem, type IGetDBItemsParams } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';
import { getResponseError } from '#/shared/utils/get-error';

const cloneDbData = (urls: DbType[], data?: IDbItem[][]): IDbItem[][] => {
  return urls.map((_, index) =>
    data && Array.isArray(data[index]) ? [...data[index]] : []
  );
};

const updateDbCache = (
  type: DbType,
  updater: (
    data: IDbItem[][],
    context: { urls: DbType[]; options?: IGetDBItemsParams }
  ) => IDbItem[][]
) => {
  queryClient
    .getQueryCache()
    .findAll({ queryKey: ['get-db-items'] })
    .forEach(query => {
      const [, urls, options] = query.queryKey as [
        string,
        DbType[],
        IGetDBItemsParams | undefined,
      ];
      if (!Array.isArray(urls) || !urls.includes(type)) return;

      const existing = query.state.data as IDbItem[][] | undefined;
      const normalized = cloneDbData(urls, existing);

      const next = updater(normalized, { urls, options });
      queryClient.setQueryData(query.queryKey, next);
    });
};

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

      queryClient.invalidateQueries({
        queryKey: ['get-db-items'],
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
