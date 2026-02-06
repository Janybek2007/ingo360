import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { PaginationParams } from '#/shared/types/global';

import type { IGetReferencesResponse } from './reference.types';

export class ReferenceQueries {
  static queryKeys = {
    getReferences: (urls: string[], options?: PaginationParams) => [
      'get-references',
      ...urls,
      options,
    ],
  };

  static GetReferencesQuery<T = IGetReferencesResponse>(
    urls: string[],
    options?: PaginationParams
  ) {
    return queryOptions({
      queryKey: this.queryKeys.getReferences(urls, options),
      queryFn: () =>
        Promise.all(
          urls.map(url =>
            http
              .get(url, {
                searchParams: qs.stringify(options, { arrayFormat: 'comma' }),
              })
              .json<T>()
          )
        ),
    });
  }
}
