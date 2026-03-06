import React, { useState } from 'react';

interface UsePaginationProperties {
  defaultLimit: number;
  defaultOffset: number;
}

export function usePagination(properties: UsePaginationProperties) {
  const [limit, setLimit] = useState(properties.defaultLimit);
  const [offset, setOffset] = useState(properties.defaultOffset);

  const next = React.useCallback(() => {
    setOffset(previous => previous + limit);
  }, [limit]);

  const previous = React.useCallback(() => {
    setOffset(previous_ => Math.max(0, previous_ - limit));
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
    prev: previous,
    goTo,
    setLimit: changeLimit,
  };
}
