export interface IUsedFilterItem {
  label: string;
  value: string;
  onDelete: () => void;
  subItems?: Omit<IUsedFilterItem, 'subItems'>[];
}

export interface IUsedFilterProps {
  usedFilterItems: IUsedFilterItem[];
  resetFilters: VoidFunction;
}
