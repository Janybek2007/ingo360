import React from 'react';

import type { IFilterActionsProps } from '../../table.types';

export const FilterActions: React.FC<IFilterActionsProps> = React.memo(
  ({ onClose, onApply }) => (
    <div className="flex justify-end gap-1.5 mt-3 pt-3 border-t border-gray-100">
      <button
        onClick={onClose}
        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
      >
        Отмена
      </button>
      <button
        onClick={onApply}
        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 border border-blue-600 rounded-lg hover:bg-blue-600 shadow-sm transition-all duration-200"
      >
        Применить
      </button>
    </div>
  )
);

FilterActions.displayName = '_FilterActions_';
