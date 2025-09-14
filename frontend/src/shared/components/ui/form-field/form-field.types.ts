import { type UseFormRegisterReturn } from 'react-hook-form';

export interface IFormFieldProps {
	label: string;
	name: string;
	type?: React.HTMLInputTypeAttribute | 'textarea';
	placeholder?: string;
	register?: UseFormRegisterReturn;
	isPasswordToggleShow?: boolean;
	classNames?: Partial<{
		wrapper: string;
		input: string;
	}>;
	color?: TColors;
	variant?: TVariants;
	error?: string
}
