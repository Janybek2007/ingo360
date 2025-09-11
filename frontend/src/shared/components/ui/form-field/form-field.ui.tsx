import { cn } from '#/shared/utils/cn';
import { uiSet } from '#/shared/utils/ui-set';
import React from 'react';
import { Icon } from '../icon';
import type { IFormFieldProps } from './form-field.types';

const FormField: React.FC<IFormFieldProps> = React.memo(
	({
		label,
		name,
		register,
		isPasswordToggleShow = false,
		placeholder = '',
		type = 'text',
		classNames,
		color = 'default',
		variant = 'outlined'
	}) => {
		const [showPassword, setShowPassword] = React.useState(false);
		const inputType = isPasswordToggleShow
			? showPassword
				? 'text'
				: 'password'
			: type;

		return (
			<div className={cn(classNames?.root)}>
				{label && (
					<label
						htmlFor={`${name}_for`}
						className={cn(
							'text-c1__1 font-medium text-base ls-base leading-5',
							classNames?.label
						)}
					>
						{label}
					</label>
				)}

				<div
					className={cn(
						'mt-4 flex items-center relative overflow-hidden',
						uiSet.colorVariant(color, variant),
						classNames?.wrapper
					)}
				>
					<input
						type={inputType}
						id={`${name}_for`}
						placeholder={placeholder}
						className={cn(
							'placeholder:text-c1__3 focus:outline-none w-[90%]',
							'text-base leading-5',
							classNames?.input
						)}
						{...register}
					/>

					{isPasswordToggleShow && (
						<button
							type='button'
							onClick={() => setShowPassword(prev => !prev)}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all hover:bg-gray-400/20 p-1 rounded-full'
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							<Icon
								name={showPassword ? 'lucide:eye-off' : 'lucide:eye'}
								size={24}
							/>
						</button>
					)}
				</div>
			</div>
		);
	}
);

FormField.displayName = '_FormField_';

export { FormField };
