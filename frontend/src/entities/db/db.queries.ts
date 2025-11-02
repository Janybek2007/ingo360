import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
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
                searchParams: this.buildQueryString(options),
              })
              .json<T>()
          )
        ),
    });
  }
  private static buildQueryString(params?: IGetDBItemsParams) {
    let p: Record<string, any> = params || {};
    if (p.type_period && p.periods.length > 0) {
      p = {
        ...p,
        type_period: this.buildTypePeriod(p.type_period),
        periods: this.parsePeriods(
          p.periods,
          params!.type_period as UsePeriodType
        ),
      };
    }

    return qs.stringify(p, { arrayFormat: 'repeat' });
  }
  private static buildTypePeriod(type_period: UsePeriodType) {
    switch (type_period) {
      case 'mat':
        return 'MAT';
      case 'ytd':
        return 'YTD';
      case 'month':
        return 'Month';
      case 'quarter':
        return 'Quarter';
      case 'year':
        return 'Year';
    }
  }

  private static parsePeriods(periods: string[], type_period: UsePeriodType) {
    return periods
      .filter(period => {
        if (type_period === 'year') {
          // "2025", либо "year-2025"
          return !period.includes('-') || period.startsWith('year-');
        }
        return period.startsWith(`${type_period}-`);
      })
      .map(period => {
        if (type_period === 'year') {
          // "2025" => "25" или "year-2025" => "25"
          const year = period.replace('year-', '');
          return year.slice(-2);
        } else {
          // "mat-2025-1" => "1-25"
          const parts = period.split('-');
          const year = parts[1]; // "2025"
          const month = parts[2]; // "1"
          return `${Number(month)}-${year.slice(-2)}`;
        }
      });
  }
}
