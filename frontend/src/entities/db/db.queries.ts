import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { ExtraDbType } from '#/shared/types/db.type';

import type {
  IGetDBItemResponse,
  IGetDBItemsParams as IGetDBItemsParameters,
  IGetLastYear,
} from './db.types';

export class DbQueries {
  static readonly queryKeys = {
    getDbItems: (urls: ExtraDbType[], query?: object) => [
      'get-db-items',
      ...urls,
      query,
    ],
    getLastYear: ['get-last-year'],
  };

  static GetLastYear(enabled = true) {
    return queryOptions({
      queryKey: DbQueries.queryKeys.getLastYear,
      queryFn: () => http.get('sales/last-year').json<IGetLastYear>(),
      enabled,
    });
  }

  static GetDbItemsQuery<T = IGetDBItemResponse>(
    urls: ExtraDbType[],
    opt: IGetDBItemsParameters & {
      enabled?: boolean;
      method?: 'GET' | 'POST';
    } = {}
  ) {
    const { method = 'GET', ...options } = {
      enabled: true,
      ...opt,
    };
    const object = this.buildOptions(options);

    return queryOptions({
      queryKey: this.queryKeys.getDbItems(urls, object),
      queryFn: () =>
        Promise.all(
          urls.map(url => {
            if (method === 'POST') {
              return http.post(url, { json: object }).json<T>();
            }

            return http
              .get(url, {
                searchParams: qs.stringify(object, { arrayFormat: 'repeat' }),
              })
              .json<T>();
          })
        ),
      enabled: options.enabled,
    });
  }

  private static buildOptions(
    parameters?: IGetDBItemsParameters
  ): Record<string, any> {
    let p: Record<string, any> = parameters || {};
    p.search = parameters?.search?.trim() || undefined;
    p.group_by_dimensions = [...new Set(p.group_by_dimensions || [])];
    delete p.enabled;

    return p;
  }
}
