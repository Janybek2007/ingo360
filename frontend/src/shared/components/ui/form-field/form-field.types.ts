import { type UseFormRegisterReturn } from 'react-hook-form';

export interface IFormFieldProps {
	label: string;
	name: string;
	type?: React.HTMLInputTypeAttribute | 'textarea';
	placeholder?: string;
	register?: UseFormRegisterReturn;
	isPasswordToggleShow?: boolean;
	classNames?: Partial<{
		root: string;
		wrapper: string;
		input: string;
		label: string;
	}>;
	color?: TColors;
	variant?: TVariants;
}
