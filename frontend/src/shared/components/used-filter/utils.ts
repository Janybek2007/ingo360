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

interface YearGroupMap {
  [year: string]: {
    items: IUsedFilterItem[];
    byType: Record<string, IUsedFilterItem[]>;
  };
}

export class PeriodGrouping {
  private static readonly PERIOD_TYPES = [
    'month',
    'quarter',
    'mat',
    'ytd',
  ] as const;
  private static readonly MAT_YTD_TYPES = ['mat', 'ytd'] as const;
  private static readonly FULL_YEAR_COUNTS: Record<string, number> = {
    month: 12,
    quarter: 4,
    mat: 12,
    ytd: 12,
  };

  private items: IUsedFilterItem[];
  private itemsCache: Map<string, any> = new Map();
  private mode: PeriodViewMode;
  private isReadOnly: boolean = false;

  constructor(
    items: IUsedFilterItem[] = [],
    mode: PeriodViewMode = 'default',
    isReadOnly: boolean = false
  ) {
    this.items = Array.isArray(items) ? items : [];
    this.mode = mode;
    this.isReadOnly = isReadOnly;
    this.validateItems();
  }

  /**
   * Основной публичный метод - единственная функция на выходе
   * Группирует периоды по годам или режиму отображения
   * @param mode - Режим отображения ('default' | 'from')
   * @returns Массив сгруппированных элементов
   */
  public group(): IUsedFilterItem[] | IGroupedPeriod[] {
    if (!this.items.length) {
      return [];
    }

    const cacheKey = `group-${this.mode}`;
    if (this.itemsCache.has(cacheKey)) {
      return this.itemsCache.get(cacheKey);
    }

    const result =
      this.mode === 'from' && this.hasMatYtdItems()
        ? this.groupMatYtd()
        : this.groupByYear();

    this.itemsCache.set(cacheKey, result);
    return result;
  }

  private parsePeriodValue(value: string | number): ParsedPeriod {
    const valueStr = String(value);
    const parts = valueStr.split('-');

    if (parts.length === 1 && /^\d{4}$/.test(valueStr)) {
      return {
        type: 'year',
        year: valueStr,
        number: undefined,
      };
    }

    return {
      type: parts[0] || '',
      year: parts[1] || '',
      number: parts[2] ? parseInt(parts[2], 10) : undefined,
    };
  }

  private isPeriodType(type: string): boolean {
    return PeriodGrouping.PERIOD_TYPES.includes(type as any);
  }

  private isMatYtdType(type: string): boolean {
    return PeriodGrouping.MAT_YTD_TYPES.includes(type as any);
  }

  private sortByPeriodNumber(items: IUsedFilterItem[]): IUsedFilterItem[] {
    return [...items].sort((a, b) => {
      const aNum = this.parsePeriodValue(a.value).number || 0;
      const bNum = this.parsePeriodValue(b.value).number || 0;
      return aNum - bNum;
    });
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
      const { type } = this.parsePeriodValue(item.value);

      if (type && groups.hasOwnProperty(type)) {
        const itemYear = this.parsePeriodValue(item.value).year;
        if (itemYear === year) {
          groups[type].push(item);
        }
      }
    }

    return groups;
  }

  private isYearComplete(items: IUsedFilterItem[]): boolean {
    if (!items.length) return false;

    const byType = this.groupByType(
      items,
      this.parsePeriodValue(items[0].value).year
    );

    for (const [type, typeItems] of Object.entries(byType)) {
      // Для режима isReadOnly игнорируем проверку полноты для month и year
      if (this.isReadOnly && (type === 'month' || type === 'year')) {
        continue;
      }

      if (typeItems.length === PeriodGrouping.FULL_YEAR_COUNTS[type]) {
        return true;
      }
    }

    return false;
  }

  private hasMatYtdItems(): boolean {
    if (!this.items.length) return false;
    const { type } = this.parsePeriodValue(this.items[0].value);
    return this.isMatYtdType(type);
  }

  private groupByYear(): IUsedFilterItem[] {
    const yearsMap: YearGroupMap = {};
    const yearItems: IUsedFilterItem[] = [];

    for (const item of this.items) {
      const { type, year } = this.parsePeriodValue(item.value);

      if (type === 'year' && !String(item.value).includes('-')) {
        yearItems.push(item);
        continue;
      }

      if (!type || !year || !this.isPeriodType(type)) {
        continue;
      }

      if (!yearsMap[year]) {
        yearsMap[year] = { items: [], byType: {} };
      }

      yearsMap[year].items.push(item);
    }

    // В режиме isReadOnly показываем годы, даже если выбран только один
    const visibleYears = this.isReadOnly
      ? yearItems
      : yearItems.length > 1
        ? yearItems
        : [];
    return [...visibleYears, ...this.filterAndFormatYears(yearsMap)];
  }

  /**
   * Группирует элементы для режима MAT/YTD ("от X")
   */
  private groupMatYtd(): IGroupedPeriod[] {
    const result: IGroupedPeriod[] = [];

    for (const item of this.items) {
      const { type, year } = this.parsePeriodValue(item.value);

      if (!type || !year || type === 'year' || !this.isPeriodType(type)) {
        continue;
      }

      const label = item.label || getPeriodLabel(item.value as string);

      result.push({
        type: type as UsePeriodType,
        year,
        items: [item],
        label: `до ${label}`,
        value: String(item.value),
        onDelete: item.onDelete,
        isReadOnly: item.isReadOnly || this.isReadOnly,
      });
    }

    return result;
  }

  /**
   * Фильтрует годы и форматирует их для отображения
   */
  private filterAndFormatYears(yearsMap: YearGroupMap): IUsedFilterItem[] {
    const result: IUsedFilterItem[] = [];

    for (const [year, { items }] of Object.entries(yearsMap)) {
      if (!this.isYearComplete(items)) {
        result.push({
          label: year,
          value: `year-${year}`,
          onDelete: () => {},
          subItems: this.sortByPeriodNumber(items),
        });
      }
    }

    return result;
  }

  /**
   * Валидирует элементы фильтра
   */
  private validateItems(): void {
    if (!Array.isArray(this.items)) {
      console.warn('[PeriodGrouping] Items должны быть массивом');
      this.items = [];
    }
  }
}
