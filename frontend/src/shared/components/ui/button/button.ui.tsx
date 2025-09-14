import { cn } from '#/shared/utils/cn';
import { uiSet } from '#/shared/utils/ui-set';
import React from 'react';
import { Icon } from '../icon';
import type { IButtonProps } from './button.types';

const Button: React.FC<IButtonProps> = React.memo(
	({
		children,
		color = 'primary',
		disabled,
		iconStart,
		iconEnd,
		onClick,
		roundedFull,
		type,
		variant = 'filled',
		wFull,
		className,
		ariaLabel
	}) => {
		const classNames = cn([
			{ ['w-full']: wFull, ['rounded-full']: roundedFull },
			'transition-all',
			uiSet.colorVariant(color, variant),
			className
		]);

		return (
			<button
				className={classNames}
				type={type}
				onClick={onClick}
				disabled={disabled}
				aria-label={ariaLabel}
			>
				{iconStart && <Icon {...uiSet.icon(iconStart)} />}
				{children}
				{iconEnd && <Icon {...uiSet.icon(iconEnd)} />}
			</button>
		);
	}
);

Button.displayName = '_Button_';

export { Button };
