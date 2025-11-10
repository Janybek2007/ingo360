import React from 'react';

import { cn } from '#/shared/utils/cn';

import { DEFAULT_ROW_ACTION_TYPE_ITEM } from './constants';
import type { IRowActionsProps } from './row-actions.types';

export const RowActions: React.FC<IRowActionsProps> = React.memo(
  ({ items }) => {
    return (
      <div className="flex items-center gap-2">
        {items.map((item, index) => {
          const actionConfig = DEFAULT_ROW_ACTION_TYPE_ITEM[item.type];
          return (
            <button
              key={`${item.type}-${index}`}
              onClick={item.onSelect}
              className={cn(
                'border border-[#E7EAE9] rounded-full p-2 group',
                'bg-white hover:bg-gray-50 transition-colors',
                'flex items-center justify-center cursor-pointer',
                'hover:border-gray-300'
              )}
              title={item.label || actionConfig.label}
            >
              {actionConfig.icon}
            </button>
          );
        })}
      </div>
    );
  }
);

RowActions.displayName = '_RowActions_';
