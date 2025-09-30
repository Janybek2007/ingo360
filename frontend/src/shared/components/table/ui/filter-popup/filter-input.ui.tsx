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
                minWidth: '18px',
                minHeight: '18px',
                maxWidth: '18px',
                maxHeight: '18px',
              }}
              className="text-gray-500"
            />
          }
          classNames={{
            trigger:
              'w-full justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400',
            triggerText: 'text-gray-700',
            menu: 'border border-gray-300 rounded-lg shadow-lg bg-white mt-1',
            menuItem:
              'text-sm px-3 py-2 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors duration-150',
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
          placeholder={colType === 'number' ? 'Число...' : 'Текст...'}
          className={cn(
            'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white',
            'text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150'
          )}
        />
        {colType === 'number' && filterType === 'between' && (
          <input
            type="number"
            value={value2}
            onChange={e => setValue2(Number(e.target.value))}
            placeholder="Число (до)..."
            className={cn(
              'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white',
              'text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150'
            )}
          />
        )}
      </div>
    );
  }
);

FilterInput.displayName = '_FilterInput_';
