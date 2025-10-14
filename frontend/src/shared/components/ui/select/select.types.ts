import type { IIconProps } from '../icon';

export interface ISelectItem<VT = string> {
  value: VT;
  label: string;
  icon?: string | IIconProps;
}

export interface ISelectProps<ISM extends boolean = false, VT = string> {
  value: ISM extends false ? VT : VT[];
  setValue: (value: ISM extends false ? VT : VT[]) => void;
  items: ISelectItem<VT>[];
  isMultiple?: ISM;
  checkbox?: boolean;
  leftIcon?: React.ReactNode | ((opened: boolean) => React.ReactNode);
  rightIcon?: React.ReactNode | ((opened: boolean) => React.ReactNode);
  triggerText?: string;
  labelTemplate?: string;
  changeTriggerText?: boolean;
  showToggleAll?: boolean;
  classNames?: Partial<{
    root: string;
    trigger: string;
    triggerText: string;
    menu: string;
    menuItem: string;
  }>;
}
