export class PeriodSorting {
  static comparator(periodType: string) {
    return (a: string, b: string) => {
      const pa = this.parse(periodType, a);
      const pb = this.parse(periodType, b);
      return pa - pb;
    };
  }
  /**
   * Универсальный компаратор для массивов, где есть item.period
   * Использование:
   *   salesData.sort(PeriodSorting.sortByPeriod(periodType))
   */
  static sortByPeriod(periodType: string) {
    return (a: { period: string }, b: { period: string }) => {
      const pa = PeriodSorting.parse(periodType, a.period);
      const pb = PeriodSorting.parse(periodType, b.period);
      return pa - pb;
    };
  }

  /**
   * Сортировка для periods_data (Object.entries)
   * Использование:
   *   Object.entries(periods_data.periods_data)
   *     .sort(PeriodSorting.sortByPeriodsData(periodType))
   */
  static sortByPeriodsData(periodType: string) {
    return (a: [string, any], b: [string, any]) => {
      const pa = PeriodSorting.parse(periodType, a[0]);
      const pb = PeriodSorting.parse(periodType, b[0]);
      return pa - pb;
    };
  }

  /**
   * Внутренний универсальный парсер периода
   */
  private static parse(periodType: string, period: string): number {
    // YEAR: "2023"
    if (periodType === 'year') {
      return Number(period);
    }

    // MONTH: "2023-01"
    if (periodType === 'month') {
      const [year, month] = period.split('-').map(Number);
      return year * 12 + month;
    }

    // QUARTER: "2023-Q1"
    if (periodType === 'quarter') {
      const [yearStr, qStr] = period.split('-');
      const year = Number(yearStr);
      const quarter = Number(qStr.replace('Q', ''));
      return year * 4 + quarter;
    }

    return 0;
  }
}
