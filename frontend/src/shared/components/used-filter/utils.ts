import type {
  IGroupedPeriod,
  IUsedFilterItem,
  PeriodViewMode,
} from '#/shared/components/used-filter/used-filter.types';
import type { UsePeriodType } from '#/shared/hooks/use-period-filter';
import { getPeriodLabel } from '#/shared/utils/get-period-label';

const PERIOD_TYPES = ['month', 'quarter', 'mat', 'ytd'] as const;
const MAT_YTD_TYPES = ['mat', 'ytd'] as const;
const FULL_YEAR_COUNTS: Record<string, number> = {
  month: 12,
  quarter: 4,
  mat: 12,
  ytd: 12,
};

/**
 * Класс для группировки периодов в фильтрах
 */
export class PeriodGrouping {
  private items: IUsedFilterItem[];

  constructor(items: IUsedFilterItem[]) {
    this.items = items;
  }

  /**
   * Основной метод группировки
   * @param mode - режим отображения ('default' | 'from')
   * @returns массив сгруппированных элементов
   */
  public group(
    mode: PeriodViewMode = 'default'
  ): IUsedFilterItem[] | IGroupedPeriod[] {
    if (!this.items.length) return [];

    // Для MAT/YTD в режиме 'from' используем специальную группировку
    if (mode === 'from' && this.isMatYtdType()) {
      return this.groupMatYtd();
    }

    // Для всех остальных случаев - стандартная группировка по годам
    return this.groupByYear();
  }

  /**
   * Проверяет, является ли тип периода MAT или YTD
   */
  public isFromMode(): boolean {
    return this.isMatYtdType();
  }

  /**
   * Группировка по годам с subItems (для month, quarter, year)
   */
  private groupByYear(): IUsedFilterItem[] {
    const yearsMap = new Map<string, IUsedFilterItem>();

    for (const item of this.items) {
      const { type, year } = this.parseItemValue(item.value);
      if (!type || !year || !this.isPeriodType(type)) continue;

      if (!yearsMap.has(year)) {
        yearsMap.set(year, {
          label: year,
          value: `year-${year}`,
          onDelete: () => {},
          subItems: [],
        });
      }

      yearsMap.get(year)!.subItems!.push(item);
    }

    return this.filterCompleteYears(yearsMap);
  }

  /**
   * Группировка для MAT/YTD в формате "от X"
   */
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

  /**
   * Фильтрует годы, убирая полностью выбранные
   */
  private filterCompleteYears(
    yearsMap: Map<string, IUsedFilterItem>
  ): IUsedFilterItem[] {
    const filtered: IUsedFilterItem[] = [];

    for (const [year, yearData] of yearsMap.entries()) {
      const subItems = yearData.subItems!;

      // Группируем по типам периодов
      const byType = this.groupByType(subItems, year);

      // Проверяем полноту каждого типа
      const hasFullYear = Object.entries(byType).some(
        ([type, items]) => items.length === FULL_YEAR_COUNTS[type]
      );

      // Если год не полный и есть элементы - добавляем
      if (!hasFullYear && subItems.length > 0) {
        filtered.push({
          ...yearData,
          subItems: this.sortByMonthNumber(subItems),
        });
      }
    }

    return filtered;
  }

  /**
   * Группирует элементы по типам периодов
   */
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

  /**
   * Сортирует элементы по номеру месяца/квартала
   */
  private sortByMonthNumber(items: IUsedFilterItem[]): IUsedFilterItem[] {
    return items.sort((a, b) => {
      const aNum = this.getMonthNumber(a.value);
      const bNum = this.getMonthNumber(b.value);
      return aNum - bNum;
    });
  }

  /**
   * Извлекает номер месяца/квартала из значения
   */
  private getMonthNumber(value: string | number): number {
    return parseInt(String(value).split('-')[2] || '0', 10);
  }

  /**
   * Парсит значение элемента на тип и год
   */
  private parseItemValue(value: string | number): {
    type: string;
    year: string;
  } {
    const parts = String(value).split('-');
    return {
      type: parts[0] || '',
      year: parts[1] || parts[0] || '',
    };
  }

  /**
   * Проверяет, является ли строка допустимым типом периода
   */
  private isPeriodType(type: string): boolean {
    return PERIOD_TYPES.includes(type as any);
  }

  /**
   * Проверяет, является ли первый элемент MAT или YTD
   */
  private isMatYtdType(): boolean {
    if (!this.items.length) return false;
    const { type } = this.parseItemValue(this.items[0].value);
    return MAT_YTD_TYPES.includes(type as any);
  }
}
