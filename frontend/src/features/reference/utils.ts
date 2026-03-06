import type { IReferenceItem } from '#/entities/reference';
import { queryClient } from '#/shared/libs/react-query';
import type { PaginationResponse } from '#/shared/types/global';
import type { ReferencesType } from '#/shared/types/references.type';

export const updateReferencesCache = (
  type: ReferencesType,
  updater: (
    data: IReferenceItem[][],
    context: { urls: string[]; options?: Record<string, any> }
  ) => IReferenceItem[][]
) => {
  for (const query of queryClient
    .getQueryCache()
    .findAll({ queryKey: ['get-references'] })) {
    const [, urls, options] = query.queryKey as [
      string,
      string[],
      Record<string, any> | undefined,
    ];
    if (!Array.isArray(urls) || !urls.includes(type)) continue;

    const existing = query.state.data as
      | PaginationResponse<IReferenceItem[]>[]
      | undefined;
    const normalized = urls.map((_, index) =>
      existing?.[index]?.result && Array.isArray(existing[index].result)
        ? [...existing[index].result]
        : []
    );

    const next = updater(normalized, { urls, options });
    queryClient.setQueryData(
      query.queryKey,
      existing
        ? existing.map((p, i) => ({ ...p, result: next[i] ?? [] }))
        : next
    );
  }
};
