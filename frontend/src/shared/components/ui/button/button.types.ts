import type { IIconProps } from '../icon';

export interface IButtonProps extends React.PropsWithChildren {
	variant?: TVariants;
	color?: TColors;
	roundedFull?: boolean;
	square?: boolean;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	icon?: IIconProps | string;
}
