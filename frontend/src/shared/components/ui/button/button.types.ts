import type { TColors, TVariants } from '#/shared/types';

import type { IIconProps } from '../icon';

export interface IButtonProps extends React.PropsWithChildren {
  variant?: TVariants;
  color?: TColors;
  roundedFull?: boolean;
  wFull?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  iconStart?: IIconProps | string;
  iconEnd?: IIconProps | string;
  className?: string;
  ariaLabel: string;
}
