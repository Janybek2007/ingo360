import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { ExtraDbType } from '#/shared/types/db.type';

import type { GetDbItemsOptions, IGetDBItemResponse } from './db.types';

export class DbQueries {
  static queryKeys = {
    getDbItems: (urls: ExtraDbType[]) => ['get-db-items', urls],
  };

  static GetDbItemsQuery<T = IGetDBItemResponse>(
    urls: ExtraDbType[],
    options?: GetDbItemsOptions
  ) {
    return queryOptions({
      queryKey: this.queryKeys.getDbItems(urls),
      queryFn: () =>
        Promise.all(
          urls.map(url =>
            http
              .get(url, {
                searchParams: qs.stringify(options),
              })
              .json<T>()
          )
        ),
    });
  }
}
