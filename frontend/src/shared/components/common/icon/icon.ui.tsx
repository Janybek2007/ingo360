import { Icon as IconifyIcon } from '@iconify/react'
import React from 'react'
import type { IconProps } from './icon.types'

export const Icon: React.FC<IconProps> = memo(({ name, ...props }) => {
	if (!name) return null;
	return (
		<IconifyIcon
			icon={name}
			className={props.className}
			width={props.size}
			height={props.size}
			{...props}
		/>
	);
});
