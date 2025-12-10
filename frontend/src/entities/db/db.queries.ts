import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';
import type { ExtraDbType } from '#/shared/types/db.type';

import type { IGetDBItemResponse, IGetDBItemsParams } from './db.types';
import { BuildQueryString } from './utils';

export class DbQueries {
  static queryKeys = {
    getDbItems: (urls: ExtraDbType[], query?: string) => [
      'get-db-items',
      ...urls,
      query,
    ],
  };

  static GetDbItemsQuery<T = IGetDBItemResponse>(
    urls: ExtraDbType[],
    opt: IGetDBItemsParams = {}
  ) {
    const options: IGetDBItemsParams = { enabled: true, method: 'GET', ...opt };
    const queryString = BuildQueryString.build(options);
    return queryOptions({
      queryKey: this.queryKeys.getDbItems(urls, queryString),
      queryFn: () =>
        Promise.all(
          urls.map(url => {
            if (options.method === 'POST') {
              return http.post(url, { json: options }).json<T>();
            }

            return http.get(url, { searchParams: queryString }).json<T>();
          })
        ),
      enabled: options.enabled,
    });
  }
}
