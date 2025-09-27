export interface ICheckedBind {
  checked?: boolean;
  onChecked: (newV: boolean) => void;
  onToggle: VoidFunction;
}

export interface ICheckboxProps extends ICheckedBind {
  classNames?: Partial<{
    root: string;
  }>;
}
