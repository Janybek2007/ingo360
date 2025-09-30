import React from 'react';

import type { IFilterActionsProps } from '../../table.types';

export const FilterActions: React.FC<IFilterActionsProps> = React.memo(
  ({ reset, onClose, onApply }) => (
    <div className="flex justify-end gap-2 mt-2">
      <button
        onClick={reset}
        className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-150"
      >
        Сбросить
      </button>
      <button
        onClick={onClose}
        className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-150"
      >
        Отмена
      </button>
      <button
        onClick={onApply}
        className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-150"
      >
        Применить
      </button>
    </div>
  )
);

FilterActions.displayName = '_FilterActions_';
