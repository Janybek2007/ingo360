import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { cn } from '#/shared/utils/cn';

import type { IFilterSelectProps } from '../../table.types';

export const FilterSelect: React.FC<IFilterSelectProps> = React.memo(
  ({ value, setValue, items }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const selectAllRef = useRef<HTMLInputElement>(null);

    const allSelected = useMemo(
      () => value.length === items.length,
      [value, items]
    );
    const someSelected = useMemo(
      () => value.length > 0 && value.length < items.length,
      [value, items]
    );

    useEffect(() => {
      if (selectAllRef.current)
        selectAllRef.current.indeterminate = someSelected;
    }, [someSelected]);

    const filteredItems = useMemo(() => {
      if (!searchQuery.trim()) return items;
      const q = searchQuery.toLowerCase();
      return items.filter(item => item.label.toLowerCase().includes(q));
    }, [items, searchQuery]);

    const handleToggle = useCallback(
      (item: { label: string; value: string | number }) => {
        const isSelected = value.some(v => v.value === item.value);
        setValue(
          isSelected
            ? value.filter(v => v.value !== item.value)
            : [...value, item]
        );
      },
      [value, setValue]
    );

    const handleToggleAll = useCallback(() => {
      setValue(allSelected ? [] : items);
    }, [allSelected, items, setValue]);

    return (
      <div className="overflow-hiddens">
        {/* Поиск */}
        <div className="p-1 border-b border-gray-200">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Список */}
        <div className="max-h-60 overflow-y-auto">
          {/* Выбрать все */}
          <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer select-none hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              ref={selectAllRef}
              checked={allSelected}
              onChange={handleToggleAll}
              className="w-4 h-4 cursor-pointer accent-blue-500"
            />
            <span>Выбрать все</span>
          </label>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => {
              const isSelected = value.some(v => v.value === item.value);
              return (
                <label
                  key={item.value}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer select-none transition-colors',
                    'hover:bg-blue-50'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(item)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="truncate flex-1 text-gray-700">
                    {item.label}
                  </span>
                </label>
              );
            })
          ) : (
            <div className="px-3 py-6 text-sm text-gray-400 text-center">
              Ничего не найдено
            </div>
          )}
        </div>
      </div>
    );
  }
);

FilterSelect.displayName = '_FilterSelect_';
