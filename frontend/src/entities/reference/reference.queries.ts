import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';

import type {
  IGetReferencesParams as IGetReferencesParameters,
  IGetReferencesResponse,
} from './reference.types';

export const ReferenceQueries = {
  queryKeys: {
    getReferences: (urls: string[], options?: IGetReferencesParameters) => [
      'get-references',
      ...urls,
      options,
    ],
  },

  GetReferencesQuery<T = IGetReferencesResponse>(
    urls: string[],
    options?: IGetReferencesParameters & { method?: 'GET' | 'POST' }
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
  },
};
