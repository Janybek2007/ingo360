export type IRowActionType =
  | 'edit'
  | 'delete'
  | 'access_settings'
  | 'reset_password';

export interface IRowActionsProps {
  items: {
    type: IRowActionType;
    label?: string;
    onSelect: () => void;
  }[];
}
