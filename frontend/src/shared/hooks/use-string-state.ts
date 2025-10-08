import { useCallback, useMemo, useState } from 'react';

type UseStringStateReturn<T extends string> = [
  T | null,
  {
    set: (val: T | null) => void;
    clear: () => void;
    toggle: () => void;
  },
];

export const useStringState = <T extends string>(
  values: T[]
): UseStringStateReturn<T> => {
  const [value, setValue] = useState<T | null>(null);

  const set = useCallback(
    (val: T | null) => {
      if (val !== null && !values.includes(val)) {
        throw new Error(`Invalid value: ${val}`);
      }
      setValue(val);
    },
    [values]
  );

  const clear = useCallback(() => setValue(null), []);

  const toggle = useCallback(() => {
    setValue(prev => {
      if (prev === null) return values[0];
      const index = values.indexOf(prev);
      const nextIndex = (index + 1) % values.length;
      return values[nextIndex];
    });
  }, [values]);

  const actions = useMemo(() => ({ set, clear, toggle }), [set, clear, toggle]);
  return [value, actions];
};
