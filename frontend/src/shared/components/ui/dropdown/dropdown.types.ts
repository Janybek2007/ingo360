import type { ICheckboxProps } from '../checkbox';
import type { IIconProps } from '../icon';

export interface IDropdown {
  label: string;
  icon?: string | IIconProps;
  checkbox?: Pick<ICheckboxProps, 'checked' | 'onChecked'>;
  onSelect?: VoidFunction;
}

export interface ITriggerProps {
  open: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (e: React.MouseEvent<any, MouseEvent>) => void;
}

export interface IDropdownProps {
  items: IDropdown[];
  trigger: (props: ITriggerProps) => React.ReactNode;
  classNames?: Partial<{
    root: string;
    menu: string;
    menuItem: string;
  }>;
}
