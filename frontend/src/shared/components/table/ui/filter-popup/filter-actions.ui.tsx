import React from 'react';

import type { IFilterActionsProps } from '../../table.types';

export const FilterActions: React.FC<IFilterActionsProps> = React.memo(
  ({ onClose, onApply }) => (
    <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
      >
        Отмена
      </button>
      <button
        type="button"
        onClick={onApply}
        className="px-4 py-1.5 text-xs font-medium text-white bg-blue-500 border border-blue-500 rounded-sm hover:bg-blue-600 shadow-sm transition-colors"
      >
        Применить
      </button>
    </div>
  )
);

FilterActions.displayName = '_FilterActions_';
