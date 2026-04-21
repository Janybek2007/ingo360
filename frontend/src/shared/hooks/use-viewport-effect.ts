import React from 'react';

import { useSize } from '#/shared/hooks/use-size';

import { useDpr } from './use-hight-dpr';

export const useViewportEffect = () => {
  const expHeaderSize = useSize('#exp-header');
  const sidebarSize = useSize('#sidebar');
  const scale = useDpr();

  React.useEffect(() => {
    const root = document.documentElement;

    switch (scale) {
      case 1.25: {
        root.style.setProperty('font-size', '75%');

        break;
      }
      case 1.125: {
        root.style.setProperty('font-size', '80%');

        break;
      }
      case 1: {
        root.style.setProperty('font-size', '85%');

        break;
      }
      // No default
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
