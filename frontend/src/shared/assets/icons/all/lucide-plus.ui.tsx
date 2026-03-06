import React from 'react';

import type { IStaticIconProps as IStaticIconProperties } from '../types';

export const LucidePlusIcon: React.FC<IStaticIconProperties> = React.memo(
  properties => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...properties}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 12h14m-7-7v14"
        />
      </svg>
    );
  }
);

LucidePlusIcon.displayName = '_LucidePlusIcon_';
