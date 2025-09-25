import { useCallback, useState } from 'react';

export const useCreateEditState = <T>() => {
  const [open, setOpen] = useState<'create' | 'edit' | null>(null);
  const [data, setData] = useState<T | null>(null);

  const set = useCallback(
    (type: 'create' | 'edit', data?: T) => {
      setOpen(type);
      if (data) setData(data);
    },
    [setOpen]
  );

  return [open, { set, clear: () => setOpen(null), data }] as const;
};
