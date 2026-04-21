import { useCallback, useState } from 'react';

export type TClickArea =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

export interface IAnchorPosition extends Omit<DOMRect, 'toJSON'> {
  clickArea?: TClickArea;
}

export function useAnchorPosition(): {
  position: IAnchorPosition;
  updatePosition: (e: React.MouseEvent<HTMLElement>) => void;
} {
  const [position, setPosition] = useState<IAnchorPosition>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    clickArea: 'center',
  });

  const updatePosition = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    const { clientX, clientY } = e;
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let clickArea: TClickArea;

    if (clientY < winH / 2) {
      clickArea = clientX < winW / 2 ? 'top-left' : 'top-right';
    } else {
      clickArea = clientX < winW / 2 ? 'bottom-left' : 'bottom-right';
    }

    setPosition({
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
      clickArea,
    });
  }, []);

  return { position, updatePosition };
}
