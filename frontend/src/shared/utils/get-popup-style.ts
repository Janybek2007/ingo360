import type { CSSProperties } from 'react';

import type { IAnchorPosition } from '../hooks/use-anchor-position';

export function getPopupStyle(popupPosition: IAnchorPosition): CSSProperties {
  let style: CSSProperties = { position: 'absolute' };

  switch (popupPosition.clickArea) {
    case 'top-left':
      style = {
        position: 'absolute',
        top: popupPosition.y + popupPosition.height, // под элементом
        left: popupPosition.x,
      };
      break;

    case 'top-right':
      style = {
        position: 'absolute',
        top: popupPosition.y + popupPosition.height,
        right: window.innerWidth - popupPosition.right,
      };
      break;

    case 'bottom-left':
      style = {
        position: 'absolute',
        top: popupPosition.y + popupPosition.height,
        left: popupPosition.x,
      };
      break;

    case 'bottom-right':
      style = {
        position: 'absolute',
        top: popupPosition.y + popupPosition.height,
        right: window.innerWidth - popupPosition.right,
      };
      break;

    default:
      style = {
        position: 'absolute',
        top: popupPosition.y + popupPosition.height,
        left: popupPosition.x + popupPosition.width / 2,
      };
  }

  return style;
}
