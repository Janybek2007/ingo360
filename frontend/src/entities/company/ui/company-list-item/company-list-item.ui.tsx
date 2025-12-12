import React from 'react';

import type { ICompanyItem } from '../../company.types';

interface ICompanyWithCount extends ICompanyItem {
  userCount: number;
}

export const CompanyListItem: React.FC<{
  company: ICompanyWithCount;
  onClick: () => void;
}> = React.memo(({ company, onClick }) => {
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
      className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-gray-200 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <p className="text-base text-gray-900 transition-colors duration-150">
          {company.name}
        </p>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-100">
          {company.userCount} пользователей
        </span>
      </div>
    </div>
  );
});

CompanyListItem.displayName = '_CompanyListItem_';
