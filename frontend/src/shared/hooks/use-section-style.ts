import { useSize } from './use-size';

export const useSectionStyle = () => {
  const windowSize = useSize();
  const sidebarSize = useSize('#sidebar');
  return {
    width: windowSize.width - (sidebarSize?.width || 270) - 48,
    style:
      windowSize.width == 0
        ? {}
        : ({
            width: windowSize.width - (sidebarSize?.width || 270) - 48,
          } as React.CSSProperties),
  };
};
