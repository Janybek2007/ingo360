import qs from 'qs';

import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

import type { IGetDBItemsParams } from './db.types';

export class BuildOptions {
  static build(params?: IGetDBItemsParams, asQuery = true) {
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
      delete p.group_by_period;
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
    if (asQuery) return qs.stringify(p, { arrayFormat: 'repeat' });
    return p;
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
  ) {
    const years: string[] = [];
    const quarters: string[] = [];
    const months: string[] = [];

    values.forEach(value => {
      const str = String(value);

      // "2025" или "year-2025"
      if (groupByPeriod === 'year') {
        if (/^\d{4}$/.test(str)) {
          years.push(str);
          return;
        }
        if (str.startsWith('year-')) {
          years.push(str.replace('year-', ''));
          return;
        }
        return;
      }

      if (groupByPeriod === 'quarter' && str.startsWith('quarter-')) {
        // "quarter-2025-3" → year=2025, quarter=3
        const parts = str.split('-');
        const year = parts[1];
        const quarter = parts[2];
        if (year) years.push(year);
        if (quarter) quarters.push(quarter);
        return;
      }

      if (
        (groupByPeriod === 'month' ||
          groupByPeriod === 'mat' ||
          groupByPeriod === 'ytd') &&
        (str.startsWith('month-') ||
          str.startsWith('mat-') ||
          str.startsWith('ytd-'))
      ) {
        // "month-2025-1" → year=2025, month="01"
        const parts = str.split('-');
        const year = parts[1];
        const month = parts[2];
        if (year) years.push(year);
        if (month) months.push(month.padStart(2, '0'));
        return;
      }
    });

    return {
      years: Array.from(new Set(years)),
      quarters: Array.from(new Set(quarters)),
      months: Array.from(new Set(months)),
    };
  }
}
