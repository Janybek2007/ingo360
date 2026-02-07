import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';

import type {
  IGetReferencesParams,
  IGetReferencesResponse,
} from './reference.types';

export class ReferenceQueries {
  static queryKeys = {
    getReferences: (urls: string[], options?: IGetReferencesParams) => [
      'get-references',
      ...urls,
      options,
    ],
  };

  static GetReferencesQuery<T = IGetReferencesResponse>(
    urls: string[],
    options?: IGetReferencesParams & { method?: 'GET' | 'POST' }
  ) {
    const method = options?.method ?? 'GET';

    return queryOptions({
      queryKey: this.queryKeys.getReferences(urls, options),
      queryFn: () =>
        Promise.all(
          urls.map(url => {
            if (method === 'GET') {
              return http
                .get(url, {
                  searchParams: qs.stringify(options, {
                    arrayFormat: 'comma',
                  }),
                })
                .json<T>();
            }

            return http.post(url, { json: options }).json<T>();
          })
        ),
    });
  }
}
