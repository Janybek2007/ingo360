import React from 'react';

import { Icon } from '#/shared/components/ui/icon';
import { cn } from '#/shared/utils/cn';

import type { ISortButtonsProps } from '../../table.types';

export const SortButtons: React.FC<ISortButtonsProps> = React.memo(
  ({ isSorted, toggleSorting }) => (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
        <Icon
          name="lucide:sort"
          size={16}
          className="text-gray-500 dark:text-gray-400"
        />
        Сортировка
      </h4>
      <div className="flex gap-2">
        <button
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-2 px-3 text-nowrap text-sm font-medium rounded-lg transition-colors duration-150',
            isSorted === 'asc'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          )}
          onClick={() => toggleSorting(false)}
        >
          <Icon name="lucide:arrow-up" size={14} />
          По возрастанию
        </button>
        <button
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-2 px-3 text-nowrap text-sm font-medium rounded-lg transition-colors duration-150',
            isSorted === 'desc'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-600 dark:text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          )}
          onClick={() => toggleSorting(true)}
        >
          <Icon name="lucide:arrow-down" size={14} />
          По убыванию
        </button>
      </div>
    </div>
  )
);

SortButtons.displayName = '_SortButtons_';
