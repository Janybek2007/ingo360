export interface ITabItem {
  label: string;
  value: string;
  subItems?: ITabItem[];
}

export interface ITabsChildrenProps {
  current: string;
}

export interface ITabsProps {
  children?: (arg: ITabsChildrenProps) => React.ReactNode;
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
