export interface IConfirmModalProps extends React.PropsWithChildren {
  title: string;
  message: string;
  confirmAs?: 'primary' | 'danger';
  confirmText?: string;
  cancelText?: string;
  onConfirm: VoidFunction;
  onCancel?: VoidFunction;
  onClose: VoidFunction;
  disabled?: boolean;
  error?: any;
}
