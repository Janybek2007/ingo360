import { useSize } from './use-size';

export const useSectionStyle = () => {
  const windowSize = useSize();
  return {
    width: windowSize.width - 270 - 48,
    style:
      windowSize.width == 0
        ? {}
        : ({ width: windowSize.width - 270 - 48 } as React.CSSProperties),
  };
};
