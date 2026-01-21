import React from 'react';

import { useSize } from '#/shared/hooks/use-size';

import { useDpr } from './use-hight-dpr';

export const useViewportEffect = () => {
  const expHeaderSize = useSize('#exp-header');
  const sidebarSize = useSize('#sidebar');
  const scale = useDpr();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    if (scale === 1.25) {
      root.style.setProperty('font-size', '75%');
    } else if (scale === 1.125) {
      root.style.setProperty('font-size', '80%');
    }

    if (expHeaderSize) {
      root.style.setProperty(
        '--exp-header-height',
        `${expHeaderSize.height}px`
      );
    }

    if (sidebarSize) {
      root.style.setProperty('--sidebar-width', `${sidebarSize.width}px`);
    }
  }, [expHeaderSize, sidebarSize, scale]);
};
