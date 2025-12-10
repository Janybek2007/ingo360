import type {
  IGroupedPeriod,
  IUsedFilterItem,
  PeriodViewMode,
} from '#/shared/components/used-filter/used-filter.types';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';

interface ParsedPeriod {
  type: string;
  year: string;
  number?: number;
}

interface YearGroup {
  items: IUsedFilterItem[];
}

export class PeriodGrouping {
  private static readonly PERIOD_TYPES = [
    'month',
    'quarter',
    'mat',
    'ytd',
  ] as const;
  private static readonly CUMULATIVE_TYPES = ['mat', 'ytd'] as const;
  private static readonly FULL_YEAR_COUNTS: Record<string, number> = {
    month: 12,
    quarter: 4,
    mat: 12,
    ytd: 12,
  };

  private items: IUsedFilterItem[] = [];
  private cache = new Map<string, any>();
  private mode: PeriodViewMode;
  private isReadOnly: boolean;

  constructor(
    items: IUsedFilterItem[] = [],
    mode: PeriodViewMode = 'default',
    isReadOnly = false
  ) {
    this.items = Array.isArray(items) ? items : [];
    this.mode = mode;
    this.isReadOnly = isReadOnly;
  }

  public group(): IUsedFilterItem[] | IGroupedPeriod[] {
    if (!this.items.length) return [];

    const key = `${this.mode}-${this.isReadOnly}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const result =
      this.mode === 'from' ? this.groupAsFrom() : this.groupByYear();
    this.cache.set(key, result);
    return result;
  }

  private parse(value: string | number): ParsedPeriod {
    const str = String(value);
    const parts = str.split('-');

    if (parts.length === 1 && /^\d{4}$/.test(str)) {
      return { type: 'year', year: str };
    }

    return {
      type: parts[0] || '',
      year: parts[1] || '',
      number: parts[2] ? Number(parts[2]) : undefined,
    };
  }

  private isPeriodType(type: string): type is UsePeriodType {
    return (PeriodGrouping.PERIOD_TYPES as readonly string[]).includes(type);
  }

  private isCumulativeType(type: string): boolean {
    return (PeriodGrouping.CUMULATIVE_TYPES as readonly string[]).includes(
      type
    );
  }

  private sortByNumber(items: IUsedFilterItem[]): IUsedFilterItem[] {
    return [...items].sort((a, b) => {
      const aNum = this.parse(a.value).number ?? 0;
      const bNum = this.parse(b.value).number ?? 0;
      return aNum - bNum;
    });
  }

  // Режим по умолчанию — группировка по годам
  private groupByYear(): IUsedFilterItem[] {
    const years = new Map<string, YearGroup>();
    const fullYears: IUsedFilterItem[] = [];

    for (const item of this.items) {
      const { type, year } = this.parse(item.value);

      if (type === 'year') {
        fullYears.push(item);
        continue;
      }

      if (!this.isPeriodType(type) || !year) continue;

      if (!years.has(year)) years.set(year, { items: [] });
      years.get(year)!.items.push(item);
    }

    const result: IUsedFilterItem[] = [];

    if (this.isReadOnly || fullYears.length > 1) {
      result.push(...fullYears);
    }

    for (const [year, { items }] of years) {
      if (!this.isYearComplete(items)) {
        result.push({
          label: year,
          value: `year-${year}`,
          onDelete: () => {},
          subItems: this.sortByNumber(items),
        });
      }
    }

    return result;
  }

  // Режим "from"
  private groupAsFrom(): IGroupedPeriod[] {
    const result: IGroupedPeriod[] = [];

    for (const item of this.items) {
      const { type, year } = this.parse(item.value);

      if (type === 'year' || !this.isPeriodType(type) || !year) continue;

      const baseLabel = item.label || getPeriodLabel(String(item.value));
      const label = this.isCumulativeType(type) ? `до ${baseLabel}` : baseLabel;

      result.push({
        type,
        year,
        label,
        value: String(item.value),
        items: [item],
        onDelete: item.onDelete,
      });
    }

    // Сортировка по году + номеру периода
    return result.sort((a, b) => {
      if (a.year !== b.year) return Number(a.year) - Number(b.year);
      const aNum = this.parse(a.value).number ?? 0;
      const bNum = this.parse(b.value).number ?? 0;
      return aNum - bNum;
    });
  }

  private isYearComplete(items: IUsedFilterItem[]): boolean {
    const counts: Record<string, number> = {
      month: 0,
      quarter: 0,
      mat: 0,
      ytd: 0,
    };

    for (const item of items) {
      const { type } = this.parse(item.value);
      if (this.isPeriodType(type)) counts[type]++;
    }

    for (const [type, count] of Object.entries(counts)) {
      if (this.isReadOnly && type === 'month') continue;
      if (count === PeriodGrouping.FULL_YEAR_COUNTS[type]) return true;
    }

    return false;
  }
}
