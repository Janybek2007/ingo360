import React, { useRef } from 'react';

export const useClickAway = <T = HTMLElement>(
  callback: VoidFunction,
  reference?: React.RefObject<T>
) => {
  const internalReference = useRef<T>(null);
  const _reference = reference ?? internalReference;

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        _reference.current &&
        !(_reference.current as unknown as HTMLDivElement).contains(
          event.target as Node
        )
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [_reference, callback]);

  return _reference;
};
