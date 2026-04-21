export interface IButtonProps extends React.PropsWithChildren {
  color?: 'default' | 'primary';
  roundedFull?: boolean;
  wFull?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  ariaLabel?: string;
}
