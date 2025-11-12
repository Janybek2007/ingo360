import { getMonthName } from '#/shared/utils/process-period-data';
import { stringToColor } from '#/shared/utils/string-to-color';

export type DistributorData = {
  distributor_id: number;
  distributor_name: string;
  periods_data: Record<string, { share_percent: number }>;
};

export type PeriodFilter = {
  period: 'month' | 'quarter' | 'year' | 'mat' | 'ytd';
  selectedValues: string[];
};

export type ProcessedChartData = {
  chartData: any[];
  legends: Array<{ label: string; fill: string }>;
  distributorKeys: string[];
};

export class DistributorShareProcessor {
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

    this.rawData.forEach(item => {
      distributorMap.set(item.distributor_id, {
        name: item.distributor_name,
        color: stringToColor(item.distributor_name),
      });
    });

    return distributorMap;
  }

  private getAllPeriods(): string[] {
    const periodsSet = new Set<string>();

    this.rawData.forEach(item => {
      Object.keys(item.periods_data).forEach(period => periodsSet.add(period));
    });

    return Array.from(periodsSet).sort();
  }

  private getFilteredPeriods(): string[] {
    const allPeriods = this.getAllPeriods();

    if (this.periodFilter.selectedValues.length === 0) {
      return allPeriods;
    }

    return allPeriods.filter(period => {
      const [year, month] = period.split('-');
      const monthNum = parseInt(month);
      const quarter = Math.ceil(monthNum / 3);

      if (this.periodFilter.period === 'year') {
        return this.periodFilter.selectedValues.includes(year);
      } else if (this.periodFilter.period === 'month') {
        return this.periodFilter.selectedValues.includes(
          `month-${year}-${monthNum}`
        );
      } else if (this.periodFilter.period === 'quarter') {
        return this.periodFilter.selectedValues.includes(
          `quarter-${year}-${quarter}`
        );
      }

      return true;
    });
  }

  private buildPeriodDataMap(filteredPeriods: string[]): Map<string, any> {
    const periodDataMap = new Map<string, any>();

    filteredPeriods.forEach(period => {
      const [year, month] = period.split('-');
      const monthNum = parseInt(month);
      const quarter = Math.ceil(monthNum / 3);
      const yearNum = parseInt(year);

      let key = period;
      let label = `${getMonthName(monthNum).substring(0, 3)}-${year.slice(-2)}`;
      let fullLabel = `${getMonthName(monthNum)} ${year}`;

      if (this.periodFilter.period === 'year') {
        key = year;
        label = year;
        fullLabel = year;
      } else if (this.periodFilter.period === 'quarter') {
        key = `${year}-Q${quarter}`;
        label = `${quarter}кв-${year.slice(-2)}`;
        fullLabel = `${quarter}кв ${year}`;
      }

      if (!periodDataMap.has(key)) {
        periodDataMap.set(key, {
          period: key,
          label,
          fullLabel,
          year: yearNum,
          month: monthNum,
          quarter,
          counts: new Map(),
        });
      }

      const periodData = periodDataMap.get(key);

      this.rawData.forEach(item => {
        if (item.periods_data[period]) {
          const distKey = `dist_${item.distributor_id}`;
          const sharePercent = item.periods_data[period].share_percent;

          if (!periodData[distKey]) {
            periodData[distKey] = 0;
            periodData.counts.set(distKey, 0);
          }

          periodData[distKey] += sharePercent;
          periodData.counts.set(distKey, periodData.counts.get(distKey) + 1);
        }
      });
    });

    return periodDataMap;
  }

  private processPeriodData(
    periodDataMap: Map<string, any>,
    distributorMap: Map<number, { name: string; color: string }>
  ): any[] {
    return Array.from(periodDataMap.values()).map(item => {
      const result: any = {
        label: item.label,
        fullLabel: item.fullLabel,
        year: item.year,
      };

      if (this.periodFilter.period === 'quarter') {
        result.quarter = item.quarter;
      }

      distributorMap.forEach((_, distId) => {
        const distKey = `dist_${distId}`;
        if (item[distKey] !== undefined) {
          const count = item.counts.get(distKey) || 1;
          result[distKey] = Math.round((item[distKey] / count) * 100) / 100;
        } else {
          result[distKey] = 0;
        }
      });

      return result;
    });
  }

  private sortData(data: any[]): any[] {
    return data.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      if (this.periodFilter.period === 'quarter') {
        return (a.quarter || 0) - (b.quarter || 0);
      }
      return 0;
    });
  }

  private buildLegends(
    distributorMap: Map<number, { name: string; color: string }>
  ): Array<{ label: string; fill: string }> {
    return Array.from(distributorMap.entries()).map(([_, info]) => ({
      label: info.name,
      fill: info.color,
    }));
  }

  private buildDistributorKeys(
    distributorMap: Map<number, { name: string; color: string }>
  ): string[] {
    return Array.from(distributorMap.keys()).map(id => `dist_${id}`);
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
