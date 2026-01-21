import React from 'react';

import type { IStaticIconProps } from '../types';

export const LucideRefreshCcwIcon: React.FC<IStaticIconProps> = React.memo(
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
          <path d="M21 12a9 9 0 0 0-9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9a9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
        </g>
      </svg>
    );
  }
);

LucideRefreshCcwIcon.displayName = '_LucideRefreshCcwIcon_';
