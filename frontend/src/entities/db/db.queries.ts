import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';
import type { ExtraDbType } from '#/shared/types/db.type';

import type { IGetDBItemResponse, IGetDBItemsParams } from './db.types';
import { BuildOptions } from './utils';

export class DbQueries {
  static queryKeys = {
    getDbItems: (urls: ExtraDbType[], query?: string | object) => [
      'get-db-items',
      ...urls,
      query,
    ],
  };

  static GetDbItemsQuery<T = IGetDBItemResponse>(
    urls: ExtraDbType[],
    opt: IGetDBItemsParams & {
      enabled?: boolean;
      method?: 'GET' | 'POST';
    } = {}
  ) {
    const { method = 'GET', ...options } = {
      enabled: true,
      ...opt,
    };
    const objectOrString = BuildOptions.build(options, method === 'GET');

    return queryOptions({
      queryKey: this.queryKeys.getDbItems(urls, objectOrString),
      queryFn: () =>
        Promise.all(
          urls.map(url => {
            if (method === 'POST') {
              return http.post(url, { json: objectOrString }).json<T>();
            }

            return http.get(url, { searchParams: objectOrString }).json<T>();
          })
        ),
      enabled: options.enabled,
    });
  }
}
