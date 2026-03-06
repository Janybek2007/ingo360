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
    if (this.items.length === 0) return [];

    const key = `${this.mode}-${this.isReadOnly}`;
    if (this.cache.has(key)) return this.cache.get(key)!;

    const result =
      this.mode === 'from' ? this.groupAsFrom() : this.groupByYear();

    this.cache.set(key, result);
    return result;
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

  // ===============================
  // DEFAULT MODE
  // ===============================
  private groupByYear(): IUsedFilterItem[] {
    // 1️⃣ полностью игнорируем year-элементы
    const periodItems = this.items.filter(
      it => this.parse(it.value).type !== 'year'
    );

    if (periodItems.length === 0) return [];

    // 2️⃣ ЕСЛИ РОВНО 12 МЕСЯЦЕВ / 4 КВАРТАЛА → НЕ ПОКАЗЫВАЕМ НИЧЕГО
    const detectedType = this.getFirstPeriodType(periodItems);
    if (detectedType) {
      const need = PeriodGrouping.DEFAULT_WINDOW_COUNTS[detectedType];
      const onlyThisType = periodItems.filter(
        it => this.parse(it.value).type === detectedType
      );

      if (onlyThisType.length === need) {
        return [];
      }
    }

    // 3️⃣ обычная группировка по годам
    const years = new Map<string, YearGroup>();

    for (const item of periodItems) {
      const { type, year } = this.parse(item.value);
      if (!this.isPeriodType(type) || !year) continue;

      if (!years.has(year)) years.set(year, { items: [] });
      years.get(year)!.items.push(item);
    }

    const result: IUsedFilterItem[] = [];

    // сортируем годы: 2026, 2025, ...
    const sortedYears = [...years.entries()].toSorted(
      ([a], [b]) => Number(b) - Number(a)
    );

    for (const [year, { items }] of sortedYears) {
      const sortedItems = this.sortByNumber(items);

      // если в году 1 элемент — показываем просто его
      if (sortedItems.length === 1) {
        result.push(sortedItems[0]);
        continue;
      }

      result.push({
        label: year,
        value: `year-${year}`,
        onDelete: () => {},
        subItems: sortedItems,
      });
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

    return result.toSorted((a, b) => {
      if (a.year !== b.year) return Number(a.year) - Number(b.year);
      const aNumber = this.parse(a.value).number ?? 0;
      const bNumber = this.parse(b.value).number ?? 0;
      return aNumber - bNumber;
    });
  }
}
