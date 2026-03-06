import type { CSSProperties } from 'react';

import type { IAnchorPosition } from '../hooks/use-anchor-position';

export function getPopupStyle(popupPosition: IAnchorPosition): CSSProperties {
  const top = popupPosition.y + popupPosition.height;

  switch (popupPosition.clickArea) {
    case 'top-left':
    case 'bottom-left': {
      return {
        position: 'absolute',
        top,
        left: popupPosition.x,
      };
    }

    case 'top-right':
    case 'bottom-right': {
      return {
        position: 'absolute',
        top,
        right: window.innerWidth - popupPosition.right,
      };
    }

    default: {
      return {
        position: 'absolute',
        top,
        left: popupPosition.x + popupPosition.width / 2,
      };
    }
  }
}
