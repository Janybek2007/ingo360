import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

export interface IUsedFilterItem {
  label: string;
  value: string | number;
  onDelete: VoidFunction;
  subItems?: Omit<IUsedFilterItem, 'subItems'>[];
}

export type PeriodViewMode = 'default' | 'from';

export interface IUsedFilterProps {
  usedFilterItems?: IUsedFilterItem[];
  resetFilters: VoidFunction;
  isView?: boolean;
  isViewPeriods?: boolean;
  usedPeriodFilters?: IUsedFilterItem[];
  periodViewMode?: PeriodViewMode;
}

export interface IGroupedPeriod {
  type: UsePeriodType;
  year: string;
  items: IUsedFilterItem[];
  label: string;
  value: string;
  onDelete: VoidFunction;
}
