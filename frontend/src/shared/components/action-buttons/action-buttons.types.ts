export interface IModalAction {
  onAction: VoidFunction;
  text?: string;
}

export interface IActionButtonsProps {
  primary?: IModalAction;
  cancel?: IModalAction;
}
