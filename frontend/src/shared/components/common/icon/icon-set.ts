import type { IconProps } from './icon.types';

export const iconSet = (icon: string | IconProps): IconProps => {
	return typeof icon == 'string' ? { name: icon } : icon;
};
