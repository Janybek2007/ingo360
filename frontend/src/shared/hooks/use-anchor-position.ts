import { useCallback, useState } from 'react';

export function useAnchorPosition() {
  const [position, setPosition] = useState<Omit<DOMRect, 'toJSON'>>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const updatePosition = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setPosition({
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    });
  }, []);

  return { position, updatePosition };
}
