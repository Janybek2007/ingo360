import { parsePeriodData } from '#/shared/utils/parse-period-data';
import { PeriodSorting } from '#/shared/utils/period-sorting';
import { stringToColor } from '#/shared/utils/string-to-color';

export type DistributorData = {
  distributor_id: number;
  distributor_name: string;
  periods_data: Record<string, { share_percent: number; amount: number }>;
};

type PeriodFilter = {
  period: 'month' | 'quarter' | 'year' | 'mat' | 'ytd';
  selectedValues: string[];
};

type ProcessedChartData = {
  chartData: any[];
  legends: Array<{ label: string; fill: string }>;
  distributorKeys: string[];
};

class DistributorShareProcessor {
  private rawData: DistributorData[];
  private periodFilter: PeriodFilter;

  constructor(rawData: DistributorData[], periodFilter: PeriodFilter) {
    this.rawData = rawData;
    this.periodFilter = periodFilter;
  }

  process(): ProcessedChartData {
    if (!this.rawData || this.rawData.length === 0) {
      return { chartData: [], legends: [], distributorKeys: [] };
    }

    const distributorMap = this.buildDistributorMap();
    const filteredPeriods = this.getFilteredPeriods();
    const periodDataMap = this.buildPeriodDataMap(filteredPeriods);
    const processedData = this.processPeriodData(periodDataMap, distributorMap);
    const sortedData = this.sortData(processedData);
    const distributorKeys = this.buildDistributorKeys(distributorMap);

    return {
      chartData: sortedData.map(item =>
        this.buildChartItem(item, distributorKeys)
      ),
      legends: this.buildLegends(distributorMap),
      distributorKeys,
    };
  }

  private buildDistributorMap(): Map<number, { name: string; color: string }> {
    const distributorMap = new Map<number, { name: string; color: string }>();

    for (const item of this.rawData) {
      distributorMap.set(item.distributor_id, {
        name: item.distributor_name,
        color: stringToColor(item.distributor_name),
      });
    }

    return distributorMap;
  }

  private getAllPeriods(): string[] {
    const periodsSet = new Set<string>();

    for (const item of this.rawData) {
      for (const period of Object.keys(item.periods_data)) {
        if (period) periodsSet.add(period);
      }
    }

    return [...periodsSet].sort(
      PeriodSorting.comparator(this.periodFilter.period)
    );
  }

  private getFilteredPeriods(): string[] {
    const allPeriods = this.getAllPeriods();

    if (this.periodFilter.selectedValues.length === 0) {
      return allPeriods;
    }

    return allPeriods.filter(periodKey => {
      const parsed = parsePeriodData(periodKey, this.periodFilter.period);

      if (this.periodFilter.period === 'year') {
        return this.periodFilter.selectedValues.includes(
          parsed.year.toString()
        );
      }

      if (this.periodFilter.period === 'month' && parsed.month) {
        const monthValue = `${parsed.month}`.padStart(2, '0');
        return this.periodFilter.selectedValues.includes(
          `month-${parsed.year}-${monthValue}`
        );
      }

      if (this.periodFilter.period === 'quarter' && parsed.quarter) {
        return this.periodFilter.selectedValues.includes(
          `quarter-${parsed.year}-${parsed.quarter}`
        );
      }

      return true;
    });
  }

  private buildPeriodDataMap(filteredPeriods: string[]): Map<string, any> {
    const periodDataMap = new Map<string, any>();

    for (const periodKey of filteredPeriods) {
      const parsed = parsePeriodData(periodKey, this.periodFilter.period);

      if (!periodDataMap.has(periodKey)) {
        periodDataMap.set(periodKey, {
          period: periodKey,
          label: parsed.label,
          fullLabel: parsed.label,
          year: parsed.year,
          month: parsed.month,
          quarter: parsed.quarter,
          counts: new Map(),
          totalAmount: 0,
        });
      }

      const periodData = periodDataMap.get(periodKey);

      for (const item of this.rawData) {
        if (item.periods_data[periodKey]) {
          const distributionKey = `dist_${item.distributor_id}`;
          const sharePercent = item.periods_data[periodKey].share_percent;
          const amount = item.periods_data[periodKey].amount ?? 0;

          if (!periodData[distributionKey]) {
            periodData[distributionKey] = 0;
            periodData.counts.set(distributionKey, 0);
          }

          periodData[distributionKey] += sharePercent;
          periodData.counts.set(
            distributionKey,
            periodData.counts.get(distributionKey) + 1
          );
          periodData.totalAmount += amount;
        }
      }
    }

    return periodDataMap;
  }

  private processPeriodData(
    periodDataMap: Map<string, any>,
    distributorMap: Map<number, { name: string; color: string }>
  ): any[] {
    return [...periodDataMap.values()].map(item => {
      const result: any = {
        label: item.label,
        fullLabel: item.fullLabel,
        year: item.year,
        totalAmount: item.totalAmount,
      };

      if (this.periodFilter.period === 'quarter') {
        result.quarter = item.quarter;
      }

      for (const [distributionId] of distributorMap.entries()) {
        const distributionKey = `dist_${distributionId}`;
        if (item[distributionKey] === undefined) {
          result[distributionKey] = 0;
        } else {
          const count = item.counts.get(distributionKey) || 1;
          result[distributionKey] =
            Math.round((item[distributionKey] / count) * 100) / 100;
        }
      }

      return result;
    });
  }

  private sortData(data: any[]): any[] {
    return data.toSorted((a, b) => {
      if (a.year !== b.year) return a.year - b.year;

      if (this.periodFilter.period === 'quarter') {
        return (a.quarter || 0) - (b.quarter || 0);
      }

      if (this.periodFilter.period === 'month') {
        return (a.month || 0) - (b.month || 0);
      }

      return 0;
    });
  }

  private buildChartItem(
    item: Record<string, number>,
    distributorKeys: string[]
  ) {
    const totalAmount = (item.totalAmount as number) ?? 0;
    const originalValues: Record<string, number> = {};
    const modifiedItem: Record<string, unknown> = { ...item };

    let topKey: string | undefined;
    let firstNegativeKey: string | undefined;

    for (const key of distributorKeys) {
      const pct = item[key] ?? 0;
      originalValues[key] = pct;

      const amount = (pct / 100) * totalAmount;
      modifiedItem[key] = amount === 0 ? 0 : amount;

      if (pct > 0) topKey = key;
      else if (pct < 0 && firstNegativeKey === undefined)
        firstNegativeKey = key;
    }

    return {
      ...modifiedItem,
      _original: originalValues,
      _topKey: topKey ?? firstNegativeKey ?? distributorKeys.at(-1),
    };
  }

  private buildLegends(
    distributorMap: Map<number, { name: string; color: string }>
  ): Array<{ label: string; fill: string }> {
    return [...distributorMap.entries()].map(([_, info]) => ({
      label: info.name,
      fill: info.color,
    }));
  }

  private buildDistributorKeys(
    distributorMap: Map<number, { name: string; color: string }>
  ): string[] {
    return [...distributorMap.keys()].map(id => `dist_${id}`);
  }
}

export function processDistributorShareData(
  rawData: DistributorData[] | undefined,
  periodFilter: PeriodFilter
): ProcessedChartData {
  if (!rawData || rawData.length === 0) {
    return { chartData: [], legends: [], distributorKeys: [] };
  }

  const processor = new DistributorShareProcessor(rawData, periodFilter);
  return processor.process();
}
