import React from 'react';

import type { IStaticIconProps as IStaticIconProperties } from '../types';

export const MdiPublishIcon: React.FC<IStaticIconProperties> = React.memo(
  properties => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        {...properties}
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M5 4v2h14V4zm0 10h4v6h6v-6h4l-7-7z"></path>
      </svg>
    );
  }
);

MdiPublishIcon.displayName = '_MdiPublishIcon_';
