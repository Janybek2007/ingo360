import type { IIconProps } from '../components/ui/icon';
import { colorVariants } from '../constants/color-variants';

// !Icon

const setIcon = (
	icon: string | IIconProps,
	args?: Omit<IIconProps, 'name'>
): IIconProps =>
	typeof icon === 'string' ? { name: icon, ...args } : { ...args, ...icon };

// !Color-Variants

const setColorVariant = (color: TColors, variant: TVariants): string =>
	colorVariants[color][variant];

// !Common

export const uiSet = {
	icon: setIcon,
	colorVariant: setColorVariant
};
