import React from 'react';

import type { IFilterActionsProps } from '../../table.types';

export const FilterActions: React.FC<IFilterActionsProps> = React.memo(
  ({ onClose, onApply }) => (
    <div className="flex justify-end gap-1.5 mt-3 pt-3 border-t border-gray-200">
      <button
        onClick={onClose}
        className="px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded"
      >
        Отмена
      </button>
      <button
        onClick={onApply}
        className="px-3 py-1.5 text-xs text-white bg-blue-500 border border-blue-500 rounded"
      >
        Применить
      </button>
    </div>
  )
);

FilterActions.displayName = '_FilterActions_';
