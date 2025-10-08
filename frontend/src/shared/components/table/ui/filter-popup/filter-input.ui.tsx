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
                minWidth: '1.125rem',
                minHeight: '1.125rem',
                maxWidth: '1.125rem',
                maxHeight: '1.125rem',
              }}
              className="text-gray-400"
            />
          }
          classNames={{
            trigger:
              'w-full justify-between border border-gray-200 rounded px-3 py-1.5 text-sm bg-white',
            triggerText: 'text-gray-700',
            menu: 'border border-gray-200 rounded bg-white mt-1',
            menuItem: 'text-sm px-3 py-2 hover:bg-gray-50 rounded',
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
            'w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white',
            'text-gray-700 placeholder:text-gray-400'
          )}
        />
        {colType === 'number' && filterType === 'between' && (
          <input
            type="number"
            value={value2}
            onChange={e => setValue2(Number(e.target.value))}
            placeholder="Введите число (до)..."
            className={cn(
              'w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white',
              'text-gray-700 placeholder:text-gray-400'
            )}
          />
        )}
      </div>
    );
  }
);

FilterInput.displayName = '_FilterInput_';
