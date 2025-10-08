import React from 'react';

import { Icon } from '#/shared/components/ui/icon';
import { cn } from '#/shared/utils/cn';

import type { ISortButtonsProps } from '../../table.types';

export const SortButtons: React.FC<ISortButtonsProps> = React.memo(
  ({ isSorted, toggleSorting, resetSorting }) => (
    <div className="mb-3">
      <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
        <Icon
          name="lucide:arrow-up-down"
          className="text-gray-400 size-[0.875rem]"
        />
        Сортировка
      </h4>
      <div className="flex gap-1.5">
        <button
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 text-xs rounded border',
            isSorted === 'asc'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'text-gray-700 border-gray-200'
          )}
          onClick={() => toggleSorting(false)}
        >
          <Icon name="lucide:arrow-up" className="size-[0.875rem]" />
          А-Я
        </button>
        <button
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 text-xs rounded border',
            isSorted === 'desc'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'text-gray-700 border-gray-200'
          )}
          onClick={() => toggleSorting(true)}
        >
          <Icon name="lucide:arrow-down" className="size-[0.875rem]" />
          Я-А
        </button>
        {isSorted && (
          <button
            className="p-1.5 text-xs text-gray-600 border border-gray-200 rounded"
            onClick={resetSorting}
            title="Сбросить сортировку"
          >
            <Icon name="lucide:x" className="size-[0.875rem]" />
          </button>
        )}
      </div>
    </div>
  )
);

SortButtons.displayName = '_SortButtons_';
