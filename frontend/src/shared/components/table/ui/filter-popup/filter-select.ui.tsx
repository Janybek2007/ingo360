import React, { useCallback } from 'react';

import { cn } from '#/shared/utils/cn';

import type { IFilterSelectProps } from '../../table.types';

export const FilterSelect: React.FC<IFilterSelectProps> = React.memo(
  ({ value, setValue, items }) => {
    const handleToggle = useCallback(
      (itemValue: string | number) => {
        const isSelected = value.includes(itemValue);
        if (isSelected) {
          setValue(value.filter(v => v !== itemValue));
        } else {
          setValue([...value, itemValue]);
        }
      },
      [value, setValue]
    );

    const handleSelectAll = useCallback(() => {
      setValue(items.map(item => item.value));
    }, [items, setValue]);

    const handleDeselectAll = useCallback(() => {
      setValue([]);
    }, [setValue]);

    return (
      <div>
        <div className="max-h-[12.5rem] overflow-y-auto pr-1">
          <div className="flex flex-wrap gap-1.5">
            {items.map(item => {
              const isSelected = value.includes(item.value);
              return (
                <div
                  key={item.value}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
                    'cursor-pointer transition-all duration-200 text-xs font-medium',
                    'border select-none',
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600 hover:border-blue-700 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  )}
                  onClick={() => handleToggle(item.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggle(item.value);
                    }
                  }}
                >
                  <span className="truncate max-w-[9.375rem]">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-1.5 mt-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="flex-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all duration-200"
          >
            Включить все
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="flex-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Отключить все
          </button>
        </div>
      </div>
    );
  }
);

FilterSelect.displayName = '_FilterSelect_';
