import React from 'react';

import type { IStaticIconProps } from '../types';

export const MyNauiLogoutIcon: React.FC<IStaticIconProps> = React.memo(
  props => {
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
          strokeWidth="1.5"
          d="M13.496 21H6.5c-1.105 0-2-1.151-2-2.571V5.57c0-1.419.895-2.57 2-2.57h7M16 15.5l3.5-3.5L16 8.5m-6.5 3.496h10"
        />
      </svg>
    );
  }
);

MyNauiLogoutIcon.displayName = '_MyNauiLogoutIcon_';
