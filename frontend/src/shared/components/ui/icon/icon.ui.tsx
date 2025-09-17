import { Icon as IconifyIcon } from '@iconify/react';
import React from 'react';

import type { IIconProps } from './icon.types';

const Icon: React.FC<IIconProps> = React.memo(({ name, ...props }) => {
  if (!name) return null;
  return (
    <IconifyIcon
      icon={name}
      className={props.className}
      width={props.size || 24}
      height={props.size || 24}
      {...props}
    />
  );
});

Icon.displayName = '_Icon_';

export { Icon };
