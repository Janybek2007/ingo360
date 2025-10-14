import React from 'react';

import { LucideXIcon } from '#/shared/components/icons';
import { Icon } from '#/shared/components/ui/icon';
import { cn } from '#/shared/utils/cn';

import type { ISortButtonsProps } from '../../table.types';

export const SortButtons: React.FC<ISortButtonsProps> = React.memo(
  ({ isSorted, toggleSorting, resetSorting }) => (
    <div className="mb-3">
      <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
        <Icon name="lucide:arrow-up-down" className="text-gray-500 size-3.5" />
        Сортировка
      </h4>
      <div className="flex gap-1">
        <button
          type="button"
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-sm border transition-colors',
            isSorted === 'asc'
              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          )}
          onClick={() => toggleSorting(false)}
        >
          <Icon name="lucide:arrow-up" className="size-3.5" />
          А-Я
        </button>
        <button
          type="button"
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-sm border transition-colors',
            isSorted === 'desc'
              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          )}
          onClick={() => toggleSorting(true)}
        >
          <Icon name="lucide:arrow-down" className="size-3.5" />
          Я-А
        </button>
        {isSorted && (
          <button
            type="button"
            className="p-1.5 text-gray-600 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
            onClick={resetSorting}
            title="Сбросить сортировку"
          >
            <LucideXIcon className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
);

SortButtons.displayName = '_SortButtons_';
