import React from 'react';

import { Button } from '#/shared/components/ui/button';

import type { IPaginationProps } from './pagination.types';

export const Pagination: React.FC<IPaginationProps> = React.memo(
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
      <div className="flex items-center gap-2 justify-end">
        <Button
          onClick={onPrev}
          disabled={!hasPrev}
          className="px-4 py-2 rounded-md font-medium disabled:cursor-not-allowed transition-colors"
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
          className="px-4 py-2 rounded-md font-medium disabled:cursor-not-allowed transition-colors"
        >
          Следующая
        </Button>
      </div>
    );
  }
);

Pagination.displayName = '_Pagination_';
