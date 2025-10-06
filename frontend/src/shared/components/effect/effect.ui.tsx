import React from 'react';

import { useSize } from '#/shared/hooks/use-size';

export const Effect: React.FC = React.memo(() => {
  const expHeaderSize = useSize('#exp-header');
  const sidebarSize = useSize('#sidebar');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const scale = window.devicePixelRatio || 1;

    if (scale === 1.25) {
      root.style.setProperty('font-size', '85%');
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
  }, [expHeaderSize, sidebarSize]);

  return null;
});

Effect.displayName = '_Effect_';
