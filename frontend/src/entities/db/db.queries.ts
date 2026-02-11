import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { ExtraDbType } from '#/shared/types/db.type';

import type { IGetDBItemResponse, IGetDBItemsParams } from './db.types';

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
    const objectOrString = this.buildOptions(options, method === 'GET');

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

  private static buildOptions(params?: IGetDBItemsParams, asQuery = true) {
    let p: Record<string, any> = params || {};
    if (params && params?.search?.trim() !== '') {
      p.search = params.search?.trim();
    } else p.search = undefined;
    p.group_by_dimensions = [...new Set(p.group_by_dimensions || [])];
    // delete p.period_values;
    delete p.enabled;
    if (asQuery) return qs.stringify(p, { arrayFormat: 'repeat' });
    return p;
  }
}
