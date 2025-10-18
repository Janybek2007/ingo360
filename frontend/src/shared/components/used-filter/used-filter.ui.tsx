import React from 'react';

import { LucideXIcon } from '../icons';
import type { IUsedFilterItem, IUsedFilterProps } from './used-filter.types';

export const UsedFilter: React.FC<IUsedFilterProps> = ({
  usedFilterItems,
  resetFilters,
}) => {
  const groupedItems = React.useMemo(() => {
    const yearsMap = new Map<string, IUsedFilterItem>();
    const result: IUsedFilterItem[] = [];

    usedFilterItems.forEach(item => {
      const [type, year] = String(item.value).split('-');
      if (type === 'year') {
        const yearItem = { ...item, subItems: [] };
        yearsMap.set(year, yearItem);
        result.push(yearItem);
      }
    });

    usedFilterItems.forEach(item => {
      const [type, year] = String(item.value).split('-');
      if ((type === 'month' || type === 'quarter') && yearsMap.has(year)) {
        yearsMap
          .get(year)!
          .subItems!.push({ ...item, label: item.label.split(' ')[0] });
      }
    });

    yearsMap.forEach(yearItem => {
      yearItem.subItems?.sort(
        (a, b) =>
          Number(String(a.value).split('-')[2]) -
          Number(String(b.value).split('-')[2])
      );
    });

    usedFilterItems.forEach(item => {
      const [type] = String(item.value).split('-');
      if (!['year', 'month', 'quarter'].includes(type)) {
        result.push(item);
      }
    });

    return result;
  }, [usedFilterItems]);

  if (!groupedItems.length) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap font-inter select-none">
      {groupedItems.map(item => (
        <div
          key={item.value}
          className={`flex items-center gap-2 ${item.subItems?.length ? 'bg-gray-50/50 rounded-lg p-2 border border-gray-100' : ''}`}
        >
          <div className="group flex items-center gap-2 px-3 py-1.5 bg-white text-gray-600 rounded-md text-sm border border-gray-200/60 shadow-xs hover:border-gray-300/60 transition-colors">
            <span className="font-medium">{item.label}</span>
            <button
              type="button"
              onClick={item.onDelete}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={`Удалить фильтр ${item.label}`}
            >
              <LucideXIcon className="size-4" />
            </button>
          </div>

          {item.subItems?.length ? (
            <div className="flex items-center gap-1.5">
              {item.subItems.map(sub => (
                <button
                  key={sub.value}
                  onClick={sub.onDelete}
                  className="group flex items-center gap-1.5 px-2.5 py-1 bg-white text-gray-500 rounded-md text-xs border border-gray-200/50 hover:border-gray-300/50 transition-colors"
                >
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        onClick={resetFilters}
        className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
      >
        Сбросить всё
      </button>
    </div>
  );
};

UsedFilter.displayName = '_UsedFilter_';
