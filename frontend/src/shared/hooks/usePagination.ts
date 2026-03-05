import React, { useState } from 'react';

export interface UsePaginationProps {
  defaultLimit: number;
  defaultOffset: number;
}

export function usePagination(props: UsePaginationProps) {
  const [limit, setLimit] = useState(props.defaultLimit);
  const [offset, setOffset] = useState(props.defaultOffset);

  const next = React.useCallback(() => {
    setOffset(prev => prev + limit);
  }, [limit]);

  const prev = React.useCallback(() => {
    setOffset(prev => Math.max(0, prev - limit));
  }, [limit]);

  const goTo = React.useCallback((newOffset: number) => {
    setOffset(newOffset);
  }, []);

  const changeLimit = React.useCallback(
    (action: React.SetStateAction<number>) => {
      setLimit(action);
      setOffset(0);
    },
    []
  );

  return {
    limit,
    offset,
    next,
    prev,
    goTo,
    setLimit: changeLimit,
  };
}
