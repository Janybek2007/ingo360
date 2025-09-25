import React from 'react';

import { cn } from '#/shared/utils/cn';

import { Dropdown } from '../ui/dropdown';
import { Icon } from '../ui/icon';
import { DEFAULT_ROW_ACTION_TYPE_ITEM } from './constants';
import type { IRowActionsProps } from './row-actions.types';

export const RowActions: React.FC<IRowActionsProps> = React.memo(
  ({ items }) => {
    return (
      <div className="w-max">
        <Dropdown
          items={items.map(item => ({
            label: item.label || DEFAULT_ROW_ACTION_TYPE_ITEM[item.type].label,
            icon: DEFAULT_ROW_ACTION_TYPE_ITEM[item.type].icon,
            onSelect: item.onSelect,
          }))}
          trigger={({ onClick }) => (
            <button
              onClick={onClick}
              className={cn(
                'border border-[#E7EAE9] rounded-full gap-2 p-1',
                'text-left bg-white gap-1',
                'flex items-center justify-center cursor-pointer'
              )}
            >
              <Icon color="#94A3B8" size={20} name="lucide:ellipsis-vertical" />
            </button>
          )}
          classNames={{ menu: 'min-w-[240px] -ml-[200px]' }}
        />
      </div>
    );
  }
);

RowActions.displayName = '_RowActions_';
