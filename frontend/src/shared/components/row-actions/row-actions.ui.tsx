import React from 'react';

import { cn } from '#/shared/utils/cn';

import { DEFAULT_ROW_ACTION_TYPE_ITEM } from './constants';
import type { IRowActionsProps as IRowActionsProperties } from './row-actions.types';

export const RowActions: React.FC<IRowActionsProperties> = React.memo(
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
                'group rounded-full border border-[#E7EAE9] p-2',
                'bg-white transition-colors hover:bg-gray-50',
                'flex cursor-pointer items-center justify-center',
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
