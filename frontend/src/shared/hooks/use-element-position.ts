import { type RefObject, useEffect, useState } from 'react';

export type ElementPosition = {
  x: 'left' | 'right';
  y: 'top' | 'bottom';
};

export function useElementPosition<T extends HTMLElement>(
  ref: RefObject<T | null>
): ElementPosition {
  const [position, setPosition] = useState<ElementPosition>({
    x: 'left',
    y: 'top',
  });

  useEffect(() => {
    function updatePosition() {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const vertical: ElementPosition['y'] =
        rect.top + rect.height / 2 < windowHeight / 2 ? 'top' : 'bottom';
      const horizontal: ElementPosition['x'] =
        rect.left + rect.width / 2 < windowWidth / 2 ? 'left' : 'right';

      setPosition({ x: horizontal, y: vertical });
    }

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [ref]);

  return position;
}
