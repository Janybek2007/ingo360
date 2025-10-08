import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import { DbQueries, type IDbItem } from '#/entities/db';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { DbType } from '#/shared/types/db.type';
import { getError } from '#/shared/utils/get-error';

export const useAddReferenceMutation = (
  type: DbType,
  onClose: VoidFunction
) => {
  return useMutation({
    mutationKey: ['add-db-item', type],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (parsedBody: any) => {
      return http
        .post(`${type}`, {
          body: JSON.stringify(parsedBody),
        })
        .json<IDbItem>();
    },
    onSuccess: async newItem => {
      const { toast } = await import('sonner');
      queryClient.setQueryData(
        DbQueries.queryKeys.getDbItems([type]),
        (oldData: IDbItem[][] | undefined) => [
          [...(oldData?.[0] ?? []), newItem],
          ...(oldData?.slice(1) ?? []),
        ]
      );

      onClose();
      toast.success('Ресурс успешно добавлен');
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
