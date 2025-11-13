import type {
  IGroupedPeriod,
  IUsedFilterItem,
  PeriodViewMode,
} from '#/shared/components/used-filter/used-filter.types';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';

const PERIOD_TYPES = ['year', 'month', 'quarter', 'mat', 'ytd'] as const;
const MAT_YTD_TYPES = ['mat', 'ytd'] as const;
const FULL_YEAR_COUNTS: Record<string, number> = {
  month: 12,
  quarter: 4,
  mat: 12,
  ytd: 12,
  year: 1,
};

export class PeriodGrouping {
  private items: IUsedFilterItem[];

  constructor(items: IUsedFilterItem[]) {
    this.items = items;
  }

  public group(
    mode: PeriodViewMode = 'default'
  ): IUsedFilterItem[] | IGroupedPeriod[] {
    if (!this.items.length) return [];

    if (mode === 'from' && this.isMatYtdType()) {
      return this.groupMatYtd();
    }

    return this.groupByYear();
  }

  public isFromMode(): boolean {
    return this.isMatYtdType();
  }

  private groupByYear(): IUsedFilterItem[] {
    const yearsMap = new Map<string, IUsedFilterItem>();

    for (const item of this.items) {
      const { type, year } = this.parseItemValue(item.value);
      if (!type || !year || !this.isPeriodType(type)) continue;

      // Если это год сам по себе - добавляем его напрямую без группировки
      if (type === 'year') {
        yearsMap.set(year, {
          label: year,
          value: item.value, // Сохраняем оригинальное значение (просто "2025")
          onDelete: item.onDelete,
          subItems: [],
        });
        continue;
      }

      // Для периодов создаём группу года
      if (!yearsMap.has(year)) {
        yearsMap.set(year, {
          label: year,
          value: year, // Для группы используем просто год
          onDelete: () => {},
          subItems: [],
        });
      }

      yearsMap.get(year)!.subItems!.push(item);
    }

    return this.filterCompleteYears(yearsMap);
  }

  private groupMatYtd(): IGroupedPeriod[] {
    const result: IGroupedPeriod[] = [];

    for (const item of this.items) {
      const { type, year } = this.parseItemValue(item.value);
      if (!type || !year || type === 'year') continue;

      const label = getPeriodLabel(item.value);

      result.push({
        type: type as UsePeriodType,
        year,
        items: [item],
        label: `${type.toUpperCase()}: от ${label}`,
        value: String(item.value),
        onDelete: item.onDelete,
      });
    }

    return result;
  }

  private filterCompleteYears(
    yearsMap: Map<string, IUsedFilterItem>
  ): IUsedFilterItem[] {
    const filtered: IUsedFilterItem[] = [];

    for (const [year, yearData] of yearsMap.entries()) {
      const subItems = yearData.subItems!;

      if (subItems.length === 0) {
        filtered.push(yearData);
        continue;
      }

      const byType = this.groupByType(subItems, year);

      const hasFullYear = Object.entries(byType).some(
        ([type, items]) => items.length === FULL_YEAR_COUNTS[type]
      );

      if (!hasFullYear) {
        filtered.push({
          ...yearData,
          subItems: this.sortByMonthNumber(subItems),
        });
      }
    }

    return filtered;
  }

  private groupByType(
    items: IUsedFilterItem[],
    year: string
  ): Record<string, IUsedFilterItem[]> {
    const groups: Record<string, IUsedFilterItem[]> = {
      month: [],
      quarter: [],
      mat: [],
      ytd: [],
    };

    for (const item of items) {
      for (const type of PERIOD_TYPES) {
        if (String(item.value).startsWith(`${type}-${year}-`)) {
          groups[type].push(item);
          break;
        }
      }
    }

    return groups;
  }

  private sortByMonthNumber(items: IUsedFilterItem[]): IUsedFilterItem[] {
    return items.sort((a, b) => {
      const aNum = this.getMonthNumber(a.value);
      const bNum = this.getMonthNumber(b.value);
      return aNum - bNum;
    });
  }

  private getMonthNumber(value: string | number): number {
    return parseInt(String(value).split('-')[2] || '0', 10);
  }

  private parseItemValue(value: string | number): {
    type: string;
    year: string;
  } {
    const strValue = String(value);

    if (/^\d{4}$/.test(strValue)) {
      return {
        type: 'year',
        year: strValue,
      };
    }

    const parts = strValue.split('-');
    return {
      type: parts[0] || '',
      year: parts[1] || '',
    };
  }

  private isPeriodType(type: string): boolean {
    return PERIOD_TYPES.includes(type as any);
  }

  private isMatYtdType(): boolean {
    if (!this.items.length) return false;
    const { type } = this.parseItemValue(this.items[0].value);
    return MAT_YTD_TYPES.includes(type as any);
  }
}
