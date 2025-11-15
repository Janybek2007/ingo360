import type { UsePeriodType } from '#/shared/hooks/use-period-filter';

export interface IUsedFilterItem {
  label: string;
  value: string | number;
  onDelete: VoidFunction;
  subItems?: Omit<IUsedFilterItem, 'subItems'>[];
  isReadOnly?: boolean;
}

export type PeriodViewMode = 'default' | 'from';

export interface IUsedFilterProps {
  usedFilterItems?: IUsedFilterItem[];
  resetFilters: VoidFunction;
  isView?: boolean;
  isViewPeriods?: boolean;
  usedPeriodFilters?: IUsedFilterItem[];
  periodViewMode?: PeriodViewMode;
  className?: string;
  isReadOnly?: boolean;
}

export interface IGroupedPeriod {
  type: UsePeriodType;
  year: string;
  items: IUsedFilterItem[];
  label: string;
  value: string;
  onDelete: VoidFunction;
  isReadOnly?: boolean;
}
