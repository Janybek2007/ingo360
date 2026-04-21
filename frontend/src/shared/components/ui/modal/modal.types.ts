export interface IModalProps extends React.PropsWithChildren {
  title: string;
  onClose: VoidFunction;
  closeOnOverlayClick?: boolean;
  classNames?: Partial<{
    body: string;
    root: string;
  }>;
}
