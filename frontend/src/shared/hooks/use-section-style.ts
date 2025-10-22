import { useMemo } from 'react';

import { useSize } from './use-size';

export const useSectionStyle = () => {
  const windowSize = useSize();
  const sidebarSize = useSize('#sidebar');

  const width = useMemo(() => {
    if (windowSize.width && sidebarSize?.width) {
      return windowSize.width - sidebarSize.width - 48;
    }
    return 0;
  }, [windowSize.width, sidebarSize?.width]);

  return {
    width,
    style: windowSize.width == 0 ? {} : ({ width } as React.CSSProperties),
  };
};
