export interface ITabItem {
  label: string;
  value: string;
}

export interface ITabsChildrenProps {
  current: string;
  set: (newValue: string) => void;
}

export interface ITabsProps {
  children?: (arg: ITabsChildrenProps) => React.ReactNode;
  items: ITabItem[];
  saveCurrent(current: string): void;
  defaultValue?: string;
  classNames?: Partial<{
    root: string;
    tabs: string;
    content: string;
  }>;
}
