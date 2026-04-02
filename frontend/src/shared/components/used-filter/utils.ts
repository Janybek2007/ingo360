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

  // сколько элементов считается "дефолтным окном"
  private static readonly DEFAULT_WINDOW_COUNTS: Record<string, number> = {
    month: 12,
    quarter: 4,
    mat: 12,
    ytd: 12,
  };
  private current?: { y: number; m: number; q: number };
  private lastYear?: number;

  private items: IUsedFilterItem[] = [];
  private cache = new Map<string, any>();
  private mode: PeriodViewMode;
  private isReadOnly: boolean;

  constructor(
    items: IUsedFilterItem[] = [],
    mode: PeriodViewMode = 'default',
    isReadOnly = false,
    current?: typeof this.current,
    lastYear?: number
  ) {
    this.items = Array.isArray(items) ? items : [];
    this.mode = mode;
    this.isReadOnly = isReadOnly;
    this.current = current;
    this.lastYear = lastYear;
  }

  public group(): IUsedFilterItem[] | IGroupedPeriod[] {
    if (this.items.length === 0) return [];

    const key = `${this.mode}-${this.isReadOnly}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const result =
      this.mode === 'from' ? this.groupAsFrom() : this.groupByYear();

    this.cache.set(key, result);
    return result;
  }

  // Реальное кол-во элементов для "дефолтного окна"
  private getEffectiveWindowCount(type: string, year: string): number {
    const base = PeriodGrouping.DEFAULT_WINDOW_COUNTS[type] ?? 12;
    if (!this.current) return base;
    const numericYear = Number(year);
    if (
      numericYear !== this.current.y &&
      (this.lastYear === undefined || numericYear !== this.lastYear)
    )
      return base;

    // Текущий год — ограничиваем реальными данными
    if (numericYear === this.current.y) {
      if (type === 'quarter') return this.current.q;
      if (type === 'month' || type === 'mat' || type === 'ytd')
        return this.current.m;
    }

    return base;
  }

  private parse(value: string | number): ParsedPeriod {
    const string_ = String(value);
    const parts = string_.split('-');

    if (parts.length === 1 && /^\d{4}$/.test(string_)) {
      return { type: 'year', year: string_ };
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
    return items.toSorted((a, b) => {
      const aNumber = this.parse(a.value).number ?? 0;
      const bNumber = this.parse(b.value).number ?? 0;
      return aNumber - bNumber;
    });
  }

  private getFirstPeriodType(items: IUsedFilterItem[]): UsePeriodType | null {
    for (const item of items) {
      const { type } = this.parse(item.value);
      if (this.isPeriodType(type)) return type;
    }
    return null;
  }

  private getNonYearItems(items: IUsedFilterItem[]): IUsedFilterItem[] {
    return items.filter(it => this.parse(it.value).type !== 'year');
  }

  private shouldHideAllByDefault(
    periodItems: IUsedFilterItem[],
    detectedType: UsePeriodType | null
  ): boolean {
    if (!detectedType || !this.current) return false;

    const onlyThisType = periodItems.filter(
      it => this.parse(it.value).type === detectedType
    );
    const totalSelected = onlyThisType.length;
    const base = PeriodGrouping.DEFAULT_WINDOW_COUNTS[detectedType] ?? 12;
    const currentYearItems = onlyThisType.filter(
      it => this.parse(it.value).year === String(this.current?.y)
    );
    const currentNeed = this.getEffectiveWindowCount(
      detectedType,
      String(this.current.y)
    );

    return totalSelected === base && currentYearItems.length === currentNeed;
  }

  private buildYearMap(periodItems: IUsedFilterItem[]): Map<string, YearGroup> {
    const years = new Map<string, YearGroup>();

    for (const item of periodItems) {
      const { type, year } = this.parse(item.value);
      if (!this.isPeriodType(type) || !year) continue;

      if (!years.has(year)) years.set(year, { items: [] });
      years.get(year)!.items.push(item);
    }

    return years;
  }

  private shouldSkipYear(
    items: IUsedFilterItem[],
    detectedType: UsePeriodType | null,
    year: string
  ): boolean {
    if (!detectedType) return false;
    const need = this.getEffectiveWindowCount(detectedType, year);
    return items.length === need;
  }

  private toYearItem(year: string, items: IUsedFilterItem[]): IUsedFilterItem {
    return {
      label: year,
      value: `year-${year}`,
      onDelete: () => {},
      subItems: items,
    };
  }

  // ===============================
  // DEFAULT MODE
  // ===============================
  private groupByYear(): IUsedFilterItem[] {
    // 1️⃣ полностью игнорируем year-элементы
    const periodItems = this.getNonYearItems(this.items);

    if (periodItems.length === 0) return [];

    const detectedType = this.getFirstPeriodType(periodItems);
    if (this.shouldHideAllByDefault(periodItems, detectedType)) return [];

    // 2️⃣ обычная группировка по годам
    const years = this.buildYearMap(periodItems);

    const result: IUsedFilterItem[] = [];

    // сортируем годы: 2026, 2025, ...
    const sortedYears = [...years.entries()].toSorted(
      ([a], [b]) => Number(b) - Number(a)
    );

    for (const [year, { items }] of sortedYears) {
      const sortedItems = this.sortByNumber(items);
      if (this.shouldSkipYear(sortedItems, detectedType, year)) continue;

      // если в году 1 элемент — показываем просто его
      if (sortedItems.length === 1) {
        result.push(sortedItems[0]);
        continue;
      }

      result.push(this.toYearItem(year, sortedItems));
    }

    return result;
  }

  // ===============================
  // FROM MODE
  // ===============================
  private groupAsFrom(): IGroupedPeriod[] {
    const result: IGroupedPeriod[] = [];

    for (const item of this.items) {
      const { type, year } = this.parse(item.value);

      if (type === 'year') {
        result.push({
          type: 'year',
          year: String(item.value),
          label: `${item.value} год`,
          value: String(item.value),
          items: [item],
          onDelete: item.onDelete,
        });
        continue;
      }

      if (!this.isPeriodType(type) || !year) continue;

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

    return result.toSorted((a, b) => {
      if (a.year !== b.year) return Number(a.year) - Number(b.year);
      const aNumber = this.parse(a.value).number ?? 0;
      const bNumber = this.parse(b.value).number ?? 0;
      return aNumber - bNumber;
    });
  }
}
