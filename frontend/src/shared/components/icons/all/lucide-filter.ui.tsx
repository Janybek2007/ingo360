import React from 'react';

import type { IStaticIconProps } from '../types';

export const LucideFilterIcon: React.FC<IStaticIconProps> = React.memo(
  ({ className }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={className}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M22 3H2l8 9.46V19l4 2v-8.54z"
        />
      </svg>
    );
  }
);

LucideFilterIcon.displayName = '_LucideFilterIcon_';
