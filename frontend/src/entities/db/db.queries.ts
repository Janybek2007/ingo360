import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { ExtraDbType } from '#/shared/types/db.type';

import type { IGetDBItemResponse, IGetDBItemsParams } from './db.types';

export class DbQueries {
  static queryKeys = {
    getDbItems: (urls: ExtraDbType[], options?: IGetDBItemsParams) => [
      'get-db-items',
      urls,
      options,
    ],
  };

  static GetDbItemsQuery<T = IGetDBItemResponse>(
    urls: ExtraDbType[],
    options?: IGetDBItemsParams
  ) {
    return queryOptions({
      queryKey: this.queryKeys.getDbItems(urls, options),
      queryFn: () =>
        Promise.all(
          urls.map(url =>
            http
              .get(url, {
                searchParams: qs.stringify(options, { arrayFormat: 'repeat' }),
              })
              .json<T>()
          )
        ),
    });
  }
}
