import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';
import type { DbType } from '#/shared/types/db.type';

import type { IGetDBItemResponse } from './db.types';

export class DbQueries {
  static queryKeys = {
    getDbItems: (urls: DbType[]) => ['get-db-items', urls],
  };

  static GetDbItemsQuery<T = IGetDBItemResponse>(urls: DbType[]) {
    return queryOptions({
      queryKey: this.queryKeys.getDbItems(urls),
      queryFn: () => Promise.all(urls.map(url => http.get(url).json<T>())),
    });
  }
}
