import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { cn } from '#/shared/utils/cn';

import type { IFilterSelectProps as IFilterSelectProperties } from '../../table.types';

export const FilterSelect: React.FC<IFilterSelectProperties> = React.memo(
  ({ value, setValue, items, searchQuery, setSearchQuery }) => {
    const selectAllReference = useRef<HTMLInputElement>(null);
    const listReference = useRef<HTMLDivElement>(null);

    const filteredItems = useMemo(() => {
      if (!searchQuery.trim()) return items;
      const q = searchQuery.toLowerCase();
      return items.filter(item => item.label.toLowerCase().includes(q));
    }, [items, searchQuery]);

    const allSelected = useMemo(
      () =>
        filteredItems.length > 0 &&
        filteredItems.every(item => value.some(v => v.value === item.value)),
      [value, filteredItems]
    );

    const someSelected = useMemo(
      () =>
        filteredItems.some(item => value.some(v => v.value === item.value)) &&
        !allSelected,
      [value, filteredItems, allSelected]
    );

    useEffect(() => {
      if (selectAllReference.current)
        selectAllReference.current.indeterminate = someSelected;
    }, [someSelected]);

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

    // FilterSelect
    const handleToggleAll = useCallback(() => {
      const allFilteredSelected = filteredItems.every(item =>
        value.some(v => v.value === item.value)
      );

      if (allFilteredSelected) {
        const filteredValues = new Set(filteredItems.map(i => i.value));
        setValue(value.filter(v => !filteredValues.has(v.value)));
      } else {
        const existing = new Set(value.map(v => v.value));
        const toAdd = filteredItems.filter(i => !existing.has(i.value));
        setValue([...value, ...toAdd]);
      }
    }, [filteredItems, value, setValue]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
      count: filteredItems.length,
      getScrollElement: () => listReference.current,
      estimateSize: () => 40,
      overscan: 8,
      measureElement: navigator.userAgent.includes('Firefox')
        ? element => element?.getBoundingClientRect().height
        : undefined,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    return (
      <div className="overflow-hiddens">
        {/* Поиск */}
        <div className="border-b border-gray-200 p-1">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-sm transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Список */}
        <div ref={listReference} className="max-h-60 overflow-y-auto">
          {/* Выбрать все */}
          <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors select-none hover:bg-gray-100">
            <input
              type="checkbox"
              ref={selectAllReference}
              checked={allSelected}
              onChange={handleToggleAll}
              className="h-4 w-4 cursor-pointer accent-blue-500"
            />
            <span>Выбрать все</span>
          </label>
          {filteredItems.length > 0 ? (
            <div className="relative" style={{ height: totalSize }}>
              {virtualRows.map(virtualRow => {
                const item = filteredItems[virtualRow.index];

                if (!item) return null;

                const isSelected = value.some(v => v.value === item.value);

                return (
                  <label
                    key={item.value}
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    className={cn(
                      'absolute top-0 left-0 flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition-colors select-none',
                      'hover:bg-blue-50'
                    )}
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(item)}
                      className="h-4 w-4 accent-blue-500"
                    />
                    <span className="flex-1 truncate text-gray-700">
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="px-3 py-6 text-center text-sm text-gray-400">
              Ничего не найдено
            </div>
          )}
        </div>
      </div>
    );
  }
);

FilterSelect.displayName = '_FilterSelect_';
