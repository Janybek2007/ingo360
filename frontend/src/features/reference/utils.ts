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
  const allQueries = queryClient
    .getQueryCache()
    .findAll({ queryKey: ['get-references'] });

  if (allQueries.length === 0) {
    return;
  }

  for (const query of allQueries) {
    const [, ...rest] = query.queryKey;
    const options = rest.at(-1) as Record<string, any> | undefined;
    const urls = rest.slice(0, -1) as string[];

    if (!urls.includes(type)) {
      continue;
    }

    const existing = query.state.data as
      | PaginationResponse<IReferenceItem[]>[]
      | undefined;

    const normalized = urls.map((_, index) =>
      existing?.[index]?.result && Array.isArray(existing[index].result)
        ? [...existing[index].result]
        : []
    );

    const next = updater(normalized, { urls, options });

    const newData = existing
      ? existing.map((p, i) => ({ ...p, result: next[i] ?? [] }))
      : next;

    queryClient.setQueryData(query.queryKey, newData);
  }
};
