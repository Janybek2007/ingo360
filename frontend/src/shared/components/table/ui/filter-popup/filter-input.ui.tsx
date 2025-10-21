import React from 'react';

import type { IFilterInputProps } from '#/shared/components/table/table.types';
import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';
import { cn } from '#/shared/utils/cn';

export const FilterInput: React.FC<IFilterInputProps> = React.memo(
  ({
    filterType,
    setFilterType,
    filterItems,
    colType,
    value,
    setValue,
    value2,
    setValue2,
  }) => {
    return (
      <div className="flex flex-col gap-2">
        <Select
          value={filterType}
          setValue={setFilterType}
          items={filterItems}
          triggerText="Выберите фильтр"
          changeTriggerText
          rightIcon={
            <Icon
              name="lucide:chevron-down"
              style={{
                minWidth: '0.9rem',
                minHeight: '0.8rem',
                maxWidth: '0.9rem',
                maxHeight: '0.9rem',
              }}
              className="text-gray-500"
            />
          }
          classNames={{
            trigger:
              'w-full justify-between border border-gray-300 rounded-sm px-2.5 py-2 text-sm font-medium bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors',
            triggerText: 'text-gray-700',
            menu: 'border border-gray-300 rounded-sm bg-white mt-1 shadow-lg',
            menuItem:
              'text-sm px-2.5 py-2 hover:bg-blue-50 rounded-sm justify-between',
          }}
        />
        <input
          type={colType === 'number' ? 'number' : 'text'}
          value={value}
          onChange={e => {
            setValue(
              colType === 'number' ? Number(e.target.value) : e.target.value
            );
          }}
          placeholder={
            colType === 'number' ? 'Введите число...' : 'Введите текст...'
          }
          className={cn(
            'w-full border border-gray-300 rounded-sm px-2.5 py-2 text-sm bg-white',
            'text-gray-700 placeholder:text-gray-400',
            'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
          )}
        />
        {colType === 'number' && filterType === 'between' && (
          <input
            type="number"
            value={value2}
            onChange={e => setValue2(Number(e.target.value))}
            placeholder="Введите число (до)..."
            className={cn(
              'w-full border border-gray-300 rounded-sm px-2.5 py-2 text-sm bg-white',
              'text-gray-700 placeholder:text-gray-400',
              'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors'
            )}
          />
        )}
      </div>
    );
  }
);

FilterInput.displayName = '_FilterInput_';
