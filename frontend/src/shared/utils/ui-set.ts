import type { IIconProps } from '../components/ui/icon';

// !Size
const SizeObject: Record<TSizes, number> = {
	xs: 10,
	sm: 12,
	md: 14,
	base: 16,
	lg: 18,
	xl: 20,
	'2xl': 22,
	'3xl': 24
};

const setSize = (size: TSizes = 'base') =>
	typeof size === 'number' ? size : SizeObject[size];

// !Padding
const PaddingObject = (square = false): Record<TSizes, string> => ({
	xs: square ? 'p-0.5' : 'px-1.5 py-0.5',
	sm: square ? 'p-1' : 'px-2 py-1',
	md: square ? 'p-1.5' : 'px-2.5 py-1.5',
	base: square ? 'p-2' : 'px-3 py-2',
	lg: square ? 'p-2.5' : 'px-4 py-2.5',
	xl: square ? 'p-3' : 'px-5 py-3',
	'2xl': square ? 'p-4' : 'px-6 py-4',
	'3xl': square ? 'p-5' : 'px-8 py-5'
});

const setPadding = (padding: TSizes = 'base', square = false) =>
	PaddingObject(square)[padding];

// !Rounded

const RoundedObject: Record<TSizes, string> = {
	xs: `rounded-[2px]`,
	sm: `rounded-[4px]`,
	md: `rounded-[6px]`,
	base: `rounded-[8px]`,
	lg: `rounded-[10px]`,
	xl: `rounded-[12px]`,
	'2xl': `rounded-[14px]`,
	'3xl': `rounded-[16px]`
};

const setRounded = (rounded: TSizes = 'base') => RoundedObject[rounded];

// !Icon

const setIcon = (
	icon: string | IIconProps,
	args?: Omit<IIconProps, 'name'>
): IIconProps =>
	typeof icon === 'string' ? { name: icon, ...args } : { ...args, ...icon };

// !FontSize

const FontSizeObject: Record<TSizes, string> = {
	xs: `text-[10px]`,
	sm: `text-[12px]`,
	md: `text-[14px]`,
	base: `text-[16px]`,
	lg: `text-[18px]`,
	xl: `text-[20px]`,
	'2xl': `text-[22px]`,
	'3xl': `text-[24px]`
};

const setFontSize = (fontSize: TSizes = 'base') => FontSizeObject[fontSize];

// !Common

export const uiSet = {
	size: setSize,
	rounded: setRounded,
	icon: setIcon,
	padding: setPadding,
	fontSize: setFontSize
};
