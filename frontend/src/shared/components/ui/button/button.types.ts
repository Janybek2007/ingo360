import type { TColors, TVariants } from '#/shared/types';

export interface IButtonProps extends React.PropsWithChildren {
  variant?: TVariants;
  color?: TColors;
  roundedFull?: boolean;
  wFull?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  ariaLabel?: string;
}
