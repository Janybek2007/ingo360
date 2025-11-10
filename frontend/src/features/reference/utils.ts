import type { IReferenceItem } from '#/entities/reference';
import { queryClient } from '#/shared/libs/react-query';
import type { ReferencesType } from '#/shared/types/references.type';

export const updateReferencesCache = (
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
