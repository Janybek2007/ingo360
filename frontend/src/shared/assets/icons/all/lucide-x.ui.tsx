import React from 'react';

import type { IStaticIconProps } from '../types';

export const LucideXIcon: React.FC<IStaticIconProps> = React.memo(props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      />
    </svg>
  );
});

LucideXIcon.displayName = '_LucideXIcon_';
