import React from 'react';

import type { IStaticIconProps } from '../types';

export const LucideAlertCircleIcon: React.FC<IStaticIconProps> = React.memo(
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
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4m0 4h.01" />
        </g>
      </svg>
    );
  }
);

LucideAlertCircleIcon.displayName = '_LucidAlertCircleeIcon_';
