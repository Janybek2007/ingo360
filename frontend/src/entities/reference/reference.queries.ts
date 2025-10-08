import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';

import type { IGetReferencesResponse } from './reference.types';

export class ReferenceQueries {
  static queryKeys = {
    getReferences: (urls: string[]) => ['get-references', urls],
  };

  static GetReferencesQuery<T = IGetReferencesResponse>(urls: string[]) {
    return queryOptions({
      queryKey: this.queryKeys.getReferences(urls),
      queryFn: () => Promise.all(urls.map(url => http.get(url).json<T>())),
    });
  }
}
