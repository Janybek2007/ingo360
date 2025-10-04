export interface IModalProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  onClose: VoidFunction;
  closeOnOverlayClick?: boolean;
  display?: 'block' | 'none' | 'flex';
  classNames?: Partial<{
    body: string;
    root: string;
  }>;
}
