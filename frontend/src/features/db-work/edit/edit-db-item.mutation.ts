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

const matchesDbOptions = (
  item: IDbItem,
  options?: IGetDBItemsParams
): boolean => {
  if (!options) return true;
  if (options.search) return false;

  const matchArray = (
    values: Array<number | string> | undefined,
    actual: number | string | undefined
  ) => {
    if (!values || values.length === 0) return true;
    if (actual === undefined || actual === null) return false;
    return values.includes(actual);
  };

  if (
    !matchArray(
      options.brand_ids as number[] | undefined,
      item.sku?.brand?.id ?? (item as any).brand_id
    )
  )
    return false;

  if (
    !matchArray(
      options.product_group_ids as number[] | undefined,
      item.product_group?.id ?? (item as any).product_group_id
    )
  )
    return false;

  if (
    !matchArray(
      options.distributor_ids as number[] | undefined,
      item.distributor?.id ?? (item as any).distributor_id
    )
  )
    return false;

  if (
    !matchArray(
      options.medical_facility_ids as number[] | undefined,
      item.medical_facility?.id ?? (item as any).medical_facility_id
    )
  )
    return false;

  if (
    !matchArray(
      options.sku_ids as number[] | undefined,
      item.sku?.id ?? item.id
    )
  )
    return false;

  if (
    !matchArray(options.months, item.month) ||
    !matchArray(options.years, item.year) ||
    !matchArray(options.quarters, item.quarter)
  )
    return false;

  return true;
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

      queryClient.invalidateQueries({
        queryKey: ['get-db-items'],
      });

      onClose();
      toast.success('Ресурс успешно редактрован');
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
