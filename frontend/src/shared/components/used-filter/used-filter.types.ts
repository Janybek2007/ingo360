export interface IUsedFilterItem {
  label: string;
  value: string | number;
  onDelete: VoidFunction;
  subItems?: Omit<IUsedFilterItem, 'subItems'>[];
}

export interface IUsedFilterProps {
  usedFilterItems: IUsedFilterItem[];
  resetFilters: VoidFunction;
  isView?: boolean;
}
