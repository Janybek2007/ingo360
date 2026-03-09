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

    return {
      chartData: sortedData,
      legends: this.buildLegends(distributorMap),
      distributorKeys: this.buildDistributorKeys(distributorMap),
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
      for (const period of Object.keys(item.periods_data))
        periodsSet.add(period);
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
      // periodKey может быть: "2023", "2023-01", "2023-Q1"
      const parsed = parsePeriodData(periodKey, this.periodFilter.period);

      if (this.periodFilter.period === 'year') {
        return this.periodFilter.selectedValues.includes(
          parsed.year.toString()
        );
      } else if (this.periodFilter.period === 'month' && parsed.month) {
        return this.periodFilter.selectedValues.includes(
          `month-${parsed.year}-${parsed.month}`
        );
      } else if (this.periodFilter.period === 'quarter' && parsed.quarter) {
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
      // periodKey может быть: "2023", "2023-01", "2023-Q1"
      const parsed = parsePeriodData(periodKey, this.periodFilter.period);

      const key = periodKey;
      const label = parsed.label;
      const fullLabel = parsed.label;

      if (!periodDataMap.has(key)) {
        periodDataMap.set(key, {
          period: key,
          label,
          fullLabel,
          year: parsed.year,
          month: parsed.month,
          quarter: parsed.quarter,
          counts: new Map(),
          totalAmount: 0,
        });
      }

      const periodData = periodDataMap.get(key);

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
      } else if (this.periodFilter.period === 'month') {
        return (a.month || 0) - (b.month || 0);
      }

      return 0;
    });
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
