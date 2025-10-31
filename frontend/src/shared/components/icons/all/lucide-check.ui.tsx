import React from 'react';

import type { IStaticIconProps } from '../types';

export const LucideCheckIcon: React.FC<IStaticIconProps> = React.memo(props => {
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
        d="M20 6L9 17l-5-5"
      />
    </svg>
  );
});

LucideCheckIcon.displayName = '_LucideCheckIcon_';
