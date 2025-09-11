import type { IIconProps } from '../components/ui/icon';

// !Icon

const setIcon = (
	icon: string | IIconProps,
	args?: Omit<IIconProps, 'name'>
): IIconProps =>
	typeof icon === 'string' ? { name: icon, ...args } : { ...args, ...icon };

// !Common

export const uiSet = {
	icon: setIcon,
};
