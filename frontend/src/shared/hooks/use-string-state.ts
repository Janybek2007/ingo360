import { useCallback, useMemo, useState } from 'react';

type UseStringStateReturn<T extends string> = [
  T | null,
  {
    set: (value: T | null) => void;
    clear: () => void;
    toggle: () => void;
  },
];

export const useStringState = <T extends string>(
  values: T[]
): UseStringStateReturn<T> => {
  const [value, setValue] = useState<T | null>(null);

  const set = useCallback(
    (value_: T | null) => {
      if (value_ !== null && !values.includes(value_)) {
        throw new Error(`Invalid value: ${value_}`);
      }
      setValue(value_);
    },
    [values]
  );

  const clear = useCallback(() => setValue(null), []);

  const toggle = useCallback(() => {
    setValue(previous => {
      if (previous === null) return values[0];
      const index = values.indexOf(previous);
      const nextIndex = (index + 1) % values.length;
      return values[nextIndex];
    });
  }, [values]);

  const actions = useMemo(() => ({ set, clear, toggle }), [set, clear, toggle]);
  return [value, actions];
};
