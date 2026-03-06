import React from 'react';

import type { IFilterActionsProps as IFilterActionsProperties } from '../../table.types';

export const FilterActions: React.FC<IFilterActionsProperties> = React.memo(
  ({ onClose, onApply }) => (
    <div className="mt-3 flex justify-end gap-2 border-t border-gray-200 pt-3">
      <button
        type="button"
        onClick={onClose}
        className="rounded-sm border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
      >
        Отмена
      </button>
      <button
        type="button"
        onClick={onApply}
        className="rounded-sm border border-blue-500 bg-blue-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
      >
        Применить
      </button>
    </div>
  )
);

FilterActions.displayName = '_FilterActions_';
