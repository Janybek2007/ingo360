import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';
import type { DbType } from '#/shared/types/db.type';

import type { IDBItemResponse } from './db.types';

export class DbQueries {
  static queryKeys = {
    getItems: (type: DbType) => ['get-db-items', type],
  };

  static GetDbItemsQuery(type: DbType) {
    return queryOptions({
      queryKey: this.queryKeys.getItems(type),
      queryFn: () => {
        return http.get(type).json<IDBItemResponse>();
      },
    });
  }
}
