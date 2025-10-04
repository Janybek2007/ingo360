import React from 'react';

import { Icon } from '#/shared/components/ui/icon';
import { Select } from '#/shared/components/ui/select';

import type { IFilterSelectProps } from '../../table.types';

export const FilterSelect: React.FC<IFilterSelectProps> = React.memo(
  ({ value, setValue, items }) => {
    return (
      <Select<true, string | number>
        value={value}
        setValue={setValue}
        items={items}
        checkbox
        triggerText="Выберите значение"
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
    );
  }
);

FilterSelect.displayName = '_FilterSelect_';
