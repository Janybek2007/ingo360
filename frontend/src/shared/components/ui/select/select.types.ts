export interface ISelectItem<VT = string> {
  value: VT;
  label: string;
}

export interface ISelectProps<ISM extends boolean = false, VT = string> {
  value: ISM extends false ? VT : VT[];
  setValue: (value: ISM extends false ? VT : VT[]) => void;
  items: ISelectItem[];
  checkbox?: boolean;
  leftIcon?: React.ReactNode | ((opened: boolean) => React.ReactNode);
  rightIcon?: React.ReactNode | ((opened: boolean) => React.ReactNode);
  triggerText: string;
  classNames?: Partial<{
    root: string;
    trigger: string;
    menu: string;
    menuItem: string;
  }>;
}
