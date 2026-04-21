import React from 'react';

import { Button } from '#/shared/components/ui/button';

import type { IPaginationProps as IPaginationProperties } from './pagination.types';

export const Pagination: React.FC<IPaginationProperties> = React.memo(
  ({
    hasNext,
    hasPrev,
    count,

    limit,
    offset,
    onNext,
    onPrev,
  }) => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={onPrev}
          disabled={!hasPrev}
          className="rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed"
        >
          Предыдущая
        </Button>
        <span>
          Страница {Math.floor(offset / limit) + 1} из{' '}
          {Math.ceil(count / limit)}
        </span>
        <Button
          onClick={onNext}
          disabled={!hasNext}
          className="rounded-md px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed"
        >
          Следующая
        </Button>
      </div>
    );
  }
);

Pagination.displayName = '_Pagination_';
