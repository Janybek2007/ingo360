import { Icon as IconifyIcon } from '@iconify/react';
import React from 'react';
import type { IIconProps } from './icon.types';

const Icon: React.FC<IIconProps> = memo(({ name, ...props }) => {
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
Icon.displayName = '_Icon_';

export { Icon };
