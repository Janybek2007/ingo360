export type IRowActionType = 'edit' | 'delete' | 'access_settings';

export interface IRowActionsProps {
  items: {
    type: IRowActionType;
    label?: string;
    onSelect: () => void;
  }[];
}
