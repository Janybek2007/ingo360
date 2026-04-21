import React from 'react';

interface IGroup {
  name: string;
  count: number;
}

export const GroupItem: React.FC<{
  group: IGroup;
  onClick: VoidFunction;
}> = React.memo(({ group, onClick }) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
          e.preventDefault();
        }
      }}
      role="button"
      tabIndex={0}
      className="flex cursor-pointer flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-gray-200"
    >
      <div className="flex items-center gap-2">
        <p className="text-base text-gray-900 transition-colors duration-150">
          {group.name}
        </p>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-100">
          {group.count} пользователей
        </span>
      </div>
    </div>
  );
});

GroupItem.displayName = '_GroupItem_';
