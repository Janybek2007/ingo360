interface ICheckedBind {
  checked?: boolean;
  onChecked: (newV: boolean) => void;
}

export interface ICheckboxProps extends ICheckedBind {
  classNames?: Partial<{
    root: string;
  }>;
}
