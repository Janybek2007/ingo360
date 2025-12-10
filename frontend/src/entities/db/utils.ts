import qs from 'qs';

import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

import type { IGetDBItemsParams } from './db.types';

export class BuildQueryString {
  static build(params?: IGetDBItemsParams) {
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
    p.group_by_dimensions = [...new Set(p.group_by_dimensions || [])];
    delete p.period_values;
    delete p.enabled;
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
