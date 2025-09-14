import { cn } from '#/shared/utils/cn';
import React from 'react';
import type { ICheckboxProps } from './checkbox.types';

const Checkbox: React.FC<ICheckboxProps> = React.memo(
	({ name, classNames, checked, onChecked }) => {
		return (
			<div className={cn('flexCenter', classNames?.root)}>
				<label className='inline-flex items-center cursor-pointer select-none'>
					<input
						type='checkbox'
						name={name}
						checked={checked}
						onChange={() => onChecked?.(!checked)}
						id={name + '_for'}
						className='sr-only'
					/>
					<span
						className={cn(
							'w-5 h-5 rounded-md border border-gray-300 flexCenter',
							'transition-all duration-200',
							checked ? 'bg-blue-500 border-blue-500' : 'bg-white'
						)}
					>
						{checked && (
							<svg
								className='w-3 h-3 text-white'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='3'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<polyline points='20 6 9 17 4 12' />
							</svg>
						)}
					</span>
				</label>
			</div>
		);
	}
);

Checkbox.displayName = '_Checkbox_';

export { Checkbox };
