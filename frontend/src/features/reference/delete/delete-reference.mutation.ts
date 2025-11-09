import { useMutation } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import type { IReferenceItem } from '#/entities/reference';
import { http } from '#/shared/api';
import { queryClient } from '#/shared/libs/react-query';
import type { ReferencesType } from '#/shared/types/references.type';
import { getResponseError } from '#/shared/utils/get-error';

const updateReferencesCache = (
  type: ReferencesType,
  updater: (
    data: IReferenceItem[][],
    context: { urls: string[]; options?: Record<string, any> }
  ) => IReferenceItem[][]
) => {
  queryClient
    .getQueryCache()
    .findAll({ queryKey: ['get-references'] })
    .forEach(query => {
      const [, urls, options] = query.queryKey as [
        string,
        string[],
        Record<string, any> | undefined,
      ];
      if (!Array.isArray(urls) || !urls.includes(type)) return;

      const existing = query.state.data as IReferenceItem[][] | undefined;
      const normalized = urls.map((_, index) =>
        existing && Array.isArray(existing[index]) ? [...existing[index]] : []
      );

      const next = updater(normalized, { urls, options });
      queryClient.setQueryData(query.queryKey, next);
    });
};

export const useDeleteReferenceMutation = (
  type: ReferencesType,
  onClose: VoidFunction,
  id?: number
) => {
  return useMutation({
    mutationKey: ['delete-reference', type, id],
    mutationFn: async () => {
      if (!id) {
        const { toast } = await import('sonner');
        toast.error('Отсутствует id ресурса');
        return null;
      }
      return http.delete(`${type}/${id}`).json<IReferenceItem>();
    },
    onSuccess: async () => {
      const { toast } = await import('sonner');

      updateReferencesCache(type, (data, { urls }) => {
        const targetIndex = urls.indexOf(type);
        if (targetIndex === -1) return data;

        data[targetIndex] = (data[targetIndex] || []).filter(
          item => item.id !== id
        );

        return data;
      });

      queryClient.invalidateQueries({
        queryKey: ['get-references'],
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
