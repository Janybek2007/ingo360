import React from 'react';

import { Icon } from '../ui/icon';
import type { IUsedFilterProps } from './used-filter.types';

export const UsedFilter: React.FC<IUsedFilterProps> = React.memo(
  ({ usedItems, resetFilters }) => {
    if (usedItems.length === 0) {
      return null;
    }

    return (
      <div className="flex items-center gap-2 flex-wrap font-inter">
        <div className="flex items-center gap-1.5">
          <Icon name="lucide:filter" className="size-4 text-gray-400" />
          <span className="text-sm text-gray-500">Фильтры:</span>
        </div>

        {usedItems.map(item => (
          <div key={item.value} className="flex items-center gap-1.5">
            {/* Главный фильтр */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-700 rounded text-sm border border-gray-200">
              <span>{item.label}</span>
              <button
                type="button"
                onClick={item.onDelete}
                className="hover:text-gray-900"
                aria-label={`Удалить фильтр ${item.label}`}
              >
                <Icon name="lucide:x" className="size-3.5" />
              </button>
            </div>

            {/* Подфильтры */}
            {item.subItems && item.subItems.length > 0 && (
              <div className="flex items-center gap-1.5">
                {item.subItems.map(subItem => (
                  <div
                    key={subItem.value}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs border border-gray-200"
                  >
                    <span>{subItem.label}</span>
                    <button
                      type="button"
                      onClick={subItem.onDelete}
                      className="hover:text-gray-900"
                      aria-label={`Удалить ${subItem.label}`}
                    >
                      <Icon name="lucide:x" className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={resetFilters}
          className="px-2.5 py-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded"
        >
          Сбросить всё
        </button>
      </div>
    );
  }
);

UsedFilter.displayName = '_UsedFilter_';
