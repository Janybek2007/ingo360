import React from 'react';

import type { CIconProps } from '../types';

export const MarketDevelopmentIcon: React.FC<CIconProps> = React.memo(
  ({ color = 'currentColor', size = 24 }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM19 7.25L12.95 14.05L9.7 10.8C9.5 10.6 9.26667 10.5 9 10.5C8.73333 10.5 8.5 10.6 8.3 10.8L5 14.1V16.95L9 12.95L12.3 16.25C12.5 16.45 12.7458 16.5458 13.0375 16.5375C13.3292 16.5292 13.5667 16.4167 13.75 16.2L19 10.25V7.25Z"
          fill={color}
        />
      </svg>
    );
  }
);

MarketDevelopmentIcon.displayName = '_MarketDevelopmentIcon_';
