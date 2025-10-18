import React from 'react';

import type { IStaticIconProps } from '../types';

export const LucideSearchIcon: React.FC<IStaticIconProps> = React.memo(
  props => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...props}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="m21 21l-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </g>
      </svg>
    );
  }
);

LucideSearchIcon.displayName = '_LucideSearchIcon_';
