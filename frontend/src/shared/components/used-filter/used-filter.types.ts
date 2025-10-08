export interface IUsedItem {
  label: string;
  value: string;
  onDelete: () => void;
  subItems?: Omit<IUsedItem, 'subItems'>[];
}

export interface IUsedFilterProps {
  usedItems: IUsedItem[];
  resetFilters: VoidFunction;
}
