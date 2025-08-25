import type { IIconProps } from './icon.types';

export const iconSet = (icon: string | IIconProps): IIconProps => {
	return typeof icon == 'string' ? { name: icon } : icon;
};
