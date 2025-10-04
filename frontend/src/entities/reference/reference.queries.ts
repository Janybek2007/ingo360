import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';

import type { IReferenceItem } from './reference.types';

export class ReferenceQueries {
  static queryKeys = {
    getReferences: (urls: string[]) => ['get-references', urls],
  };

  static GetReferencesQuery<T = IReferenceItem[]>(
    urls: string[],
    enabled = true
  ) {
    return queryOptions({
      queryKey: this.queryKeys.getReferences(urls),
      queryFn: () => Promise.all(urls.map(url => http.get(url).json<T>())),
      enabled,
    });
  }
}
