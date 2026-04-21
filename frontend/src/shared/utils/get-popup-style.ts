import type { CSSProperties } from 'react';

import type { IAnchorPosition } from '../hooks/use-anchor-position';

const MARGIN = 8;

export function getPopupStyle(
  popupPosition: IAnchorPosition,
  popupHeight = 0
): CSSProperties {
  const anchorBottom = popupPosition.y + popupPosition.height;

  const wouldOverflowBottom =
    anchorBottom + popupHeight + MARGIN > window.innerHeight;
  const hasSpaceAbove = popupPosition.y - MARGIN >= popupHeight;

  const top =
    wouldOverflowBottom && hasSpaceAbove
      ? popupPosition.y - popupHeight - MARGIN // ⬆️ флип вверх
      : anchorBottom; // ⬇️ стандартно вниз

  switch (popupPosition.clickArea) {
    case 'top-left':
    case 'bottom-left': {
      return { position: 'absolute', top, left: popupPosition.x };
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
