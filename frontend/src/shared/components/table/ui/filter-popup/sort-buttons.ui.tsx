import React from 'react';

import { Icon } from '#/shared/components/ui/icon';
import { cn } from '#/shared/utils/cn';

import type { ISortButtonsProps } from '../../table.types';

export const SortButtons: React.FC<ISortButtonsProps> = React.memo(
  ({ isSorted, toggleSorting, resetSorting }) => (
    <div className="mb-3">
      <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
        <Icon
          name="lucide:arrow-up-down"
          className="text-gray-400 size-[0.875rem]"
        />
        Сортировка
      </h4>
      <div className="flex gap-1.5">
        <button
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 text-xs font-medium rounded-lg transition-all duration-200 border',
            isSorted === 'asc'
              ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          )}
          onClick={() => toggleSorting(false)}
        >
          <Icon name="lucide:arrow-up" className="size-[0.875rem]" />
          А-Я
        </button>
        <button
          className={cn(
            'flex-1 flex items-center justify-center gap-1 py-1.5 px-2.5 text-xs font-medium rounded-lg transition-all duration-200 border',
            isSorted === 'desc'
              ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          )}
          onClick={() => toggleSorting(true)}
        >
          <Icon name="lucide:arrow-down" className="size-[0.875rem]" />
          Я-А
        </button>
        {isSorted && (
          <button
            className="p-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
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
