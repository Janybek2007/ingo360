import React from 'react';

import { LucideArrowIcon, LucideXIcon } from '#/shared/assets/icons';
import { cn } from '#/shared/utils/cn';

import type { ISortButtonsProps as ISortButtonsProperties } from '../../table.types';

export const SortButtons: React.FC<ISortButtonsProperties> = React.memo(
  ({ isSorted, toggleSorting, resetSorting }) => (
    <div className="mb-3">
      <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
        <LucideArrowIcon
          type="arrow-up-down"
          className="size-3.5 text-gray-500"
        />
        Сортировка
      </h4>
      <div className="flex gap-1">
        <button
          type="button"
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors',
            isSorted === 'asc'
              ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          )}
          onClick={() => toggleSorting(false)}
        >
          <LucideArrowIcon type="arrow-up" className="size-3.5" />
          А-Я
        </button>
        <button
          type="button"
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors',
            isSorted === 'desc'
              ? 'border-blue-500 bg-blue-500 text-white shadow-sm'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
          )}
          onClick={() => toggleSorting(true)}
        >
          <LucideArrowIcon type="arrow-down" className="size-3.5" />
          Я-А
        </button>
        {isSorted && (
          <button
            type="button"
            className="rounded-sm border border-gray-300 bg-white p-1.5 text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50"
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
