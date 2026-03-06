export interface ITabItem<T = string> {
  label: string;
  value: T;
  subItems?: ITabItem<T>[];
}

export interface ITabsChildrenProps {
  current: string;
}

export interface ITabsProps {
  children?: (argument: ITabsChildrenProps) => React.ReactNode;
  items: ITabItem[];
  saveCurrent?(current: string): void;
  defaultValue?: string;
  classNames?: Partial<{
    root: string;
    tabs: string;
    content: string;
    tab: string;
  }>;
}
