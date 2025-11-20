import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import type { ExtraDbType } from '#/shared/types/db.type';

import type { IGetDBItemResponse, IGetDBItemsParams } from './db.types';

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
    options: IGetDBItemsParams = { enabled: true }
  ) {
    return queryOptions({
      queryKey: this.queryKeys.getDbItems(urls, this.buildQueryString(options)),
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
      enabled: options?.enabled,
    });
  }
  private static buildQueryString(params?: IGetDBItemsParams) {
    let p: Record<string, any> = params || {};
    if (params?.group_by_period && Number(params?.periods?.length) > 0) {
      p = {
        ...params,
        type_period: this.buildTypePeriod(params.group_by_period),
        periods: this.parsePeriods(
          params?.periods || [],
          params!.group_by_period
        ),
      };
    }
    if (params?.group_by_period && Number(params?.filter_values?.length) > 0) {
      p = {
        ...p,
        ...this.parsePeriodFilters(
          params.group_by_period,
          params.filter_values || []
        ),
      };
    }
    if (
      params?.period_values &&
      params.period_values.length > 0 &&
      params.group_by_period
    ) {
      const periodData = this.parsePeriodValues(
        params.period_values,
        params.group_by_period
      );
      p = {
        ...p,
        years: periodData.years,
        quarters: periodData.quarters,
        months: periodData.months,
      };
    }
    if (params && params?.search?.trim() !== '') {
      p.search = params.search?.trim();
    } else p.search = undefined;

    delete p.filterValues;
    delete p.period_values;
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
  private static parsePeriodFilters(type: UsePeriodType, values: string[]) {
    if (type === 'year') {
      // "2025" или "year-2025" → "25"
      return {
        periods: values.map(v => v.replace('year-', '').slice(-2)),
      };
    } else {
      // "month-2025-1" → "1"
      // "quarter-2025-3" → "3"
      // "mat-2025-12" → "12"
      // "ytd-2025-6" → "6"
      return {
        periods: values.map(v => {
          if (typeof v !== 'string') return '';
          const parts = v.split('-');
          // ищем последнюю часть (номер месяца/периода)
          const num = parts[parts.length - 1];
          return String(Number(num)); // нормализуем, убрав ведущие нули
        }),
      };
    }
  }

  private static parsePeriods(periods: string[], type_period: UsePeriodType) {
    return periods
      .filter(period => {
        if (type_period === 'year') {
          return !period.includes('-') || period.startsWith('year-');
        }
        return period.startsWith(`${type_period}-`);
      })
      .map(period => {
        const parts = period.split('-'); // ["quarter", "2025", "1"]

        if (type_period === 'year') {
          const year = period.replace('year-', '');
          return year.slice(-2);
        }

        const year = parts[1]; // "2025"
        const value = parts[2]; // "1"

        if (type_period === 'quarter') {
          // q1-25
          return `q${Number(value)}-${year.slice(-2)}`;
        }

        // month/mat/ytd → "1-25"
        return `${Number(value)}-${year.slice(-2)}`;
      });
  }

  private static parsePeriodValues(
    values: string[],
    groupByPeriod: UsePeriodType
  ): {
    years: string[];
    quarters: string[];
    months: string[];
  } {
    const years: string[] = [];
    const quarters: string[] = [];
    const months: string[] = [];

    values.forEach(value => {
      if (groupByPeriod === 'year' && value.startsWith('year-')) {
        // "year-2025" → "2025"
        years.push(value.replace('year-', ''));
      } else if (groupByPeriod === 'quarter' && value.startsWith('quarter-')) {
        // "quarter-2025-3" → "3"
        const parts = value.split('-');
        const quarter = parts[2];
        quarters.push(quarter);
      } else if (
        (groupByPeriod === 'month' ||
          groupByPeriod === 'mat' ||
          groupByPeriod === 'ytd') &&
        (value.startsWith('month-') ||
          value.startsWith('mat-') ||
          value.startsWith('ytd-'))
      ) {
        // "month-2025-1" → "01"
        const parts = value.split('-');
        const month = parts[2];
        months.push(month.padStart(2, '0'));
      }
    });

    return { years, quarters, months };
  }
}
