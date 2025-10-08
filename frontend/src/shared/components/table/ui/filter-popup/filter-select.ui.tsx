import React, { useCallback } from 'react';

import { cn } from '#/shared/utils/cn';

import type { IFilterSelectProps } from '../../table.types';

export const FilterSelect: React.FC<IFilterSelectProps> = React.memo(
  ({ value, setValue, items }) => {
    const handleToggle = useCallback(
      (item: { label: string; value: string | number }) => {
        const isSelected = value.some(v => v.value === item.value);
        if (isSelected) {
          setValue(value.filter(v => v.value !== item.value));
        } else {
          setValue([...value, item]);
        }
      },
      [value, setValue]
    );

    const handleSelectAll = useCallback(() => {
      setValue(items);
    }, [items, setValue]);

    const handleDeselectAll = useCallback(() => {
      setValue([]);
    }, [setValue]);

    return (
      <div>
        <div className="max-h-[12.5rem] overflow-y-auto pr-1">
          <div className="flex flex-wrap gap-1.5">
            {items.map(item => {
              const isSelected = value.some(v => v.value === item.value);
              return (
                <div
                  key={item.value}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded',
                    'cursor-pointer text-xs border select-none',
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  )}
                  onClick={() => handleToggle(item)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggle(item);
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
            className="flex-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded"
          >
            Включить все
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="flex-1 px-2 py-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded"
          >
            Отключить все
          </button>
        </div>
      </div>
    );
  }
);

FilterSelect.displayName = '_FilterSelect_';
