import type { UseFormRegisterReturn } from 'react-hook-form';

export interface CheckboxProps {
	name?: string;
	classNames?: Partial<{
		root: string;
	}>;
	checked?: boolean;
	register?: UseFormRegisterReturn;
}
