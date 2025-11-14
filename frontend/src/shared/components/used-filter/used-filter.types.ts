import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

/**
 * Описание элемента используемого фильтра (выпадающий фильтр или период)
 */
export interface IUsedFilterItem {
  label: string;
  value: string | number;
  onDelete: VoidFunction;
  // Если фильтр составной: список подфильтров (например, месяцы внутри года)
  subItems?: Omit<IUsedFilterItem, 'subItems'>[];
}

/** Режим отображения периодов: стандартный или "от" (from) */
export type PeriodViewMode = 'default' | 'from';

/**
 * Свойства компонента UsedFilter
 */
export interface IUsedFilterProps {
  /** Основные фильтры (кроме периода) */
  usedFilterItems?: IUsedFilterItem[];
  /** Коллбек сброса фильтров */
  resetFilters: VoidFunction;
  /** Показывать основные фильтры */
  isView?: boolean;
  /** Показывать выбранные периоды */
  isViewPeriods?: boolean;
  /** Выбранные периоды */
  usedPeriodFilters?: IUsedFilterItem[];
  /** Режим отображения периодов */
  periodViewMode?: PeriodViewMode;
  /** Дополнительный CSS класс */
  className?: string;
  /** Режим только для чтения (без удаления) */
  isReadMode?: boolean;
}

/**
 * Сгруппированный период для отображения в фильтрах
 */
export interface IGroupedPeriod {
  type: UsePeriodType;
  year: string;
  /** Все элементы этого периода (например, 12 месяцев/4 квартала) */
  items: IUsedFilterItem[];
  /** Текстовая надпись для элемента (например, "2024" или "YTD: от Января 2024") */
  label: string;
  value: string;
  onDelete: VoidFunction;
}
