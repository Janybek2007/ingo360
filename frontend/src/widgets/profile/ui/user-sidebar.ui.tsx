import React from 'react';

import { Assets } from '#/shared/assets';
import { cn } from '#/shared/utils/cn';

import type { TTabType } from '../profile-content.ui';

// import { Checkbox } from '#/shared/components/ui/checkbox';
// import { FormField } from '#/shared/components/ui/form-field';
// import { routePaths } from '#/shared/router';

interface IUserSidebarProps {
  activeTab: TTabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TTabType>>;
}

export const UserSideBar: React.FC<IUserSidebarProps> = React.memo(
  ({ activeTab, setActiveTab }) => {
    return (
      <aside className="min-w-[266px] max-w-[266px] max bg-white p-6 rounded-2xl">
        {/* IMG ВРЕМЕННО ПОСТАВЛЕНО */}
        <div className="flex flex-col gap-7 mt-1">
          {/* USER PHOTO  */}
          <img
            className="w-[64px] h-[64px] rounded-[100px]"
            src={Assets.DefaultAvatar}
            alt=""
          />
          <div className="mt-[-17px]">
            {/* USER NAME  */}
            <h1 className="text-gray-950 font-bold">Michael Williams</h1>
            {/* USERS EMAIL  */}
            <p className="text-[13px]">expamle.willams.@gmail.com</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 mt-9">
          {[
            { label: 'Настройка аккаунта', value: 'account-settings' },
            { label: 'Помощь', value: 'help' },
            { label: 'Выйти', value: 'exit' },
          ].map((tab, i) => (
            <button
              key={i}
              className={cn(
                'w-full text-left bg-gray-100 hover:bg-gray-200 py-3 px-6 font-inter rounded-[10px] text-medium text-sm',
                activeTab === tab.value && 'bg-gray-200'
              )}
              onClick={() => setActiveTab(tab.value as TTabType)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </aside>
    );
  }
);

UserSideBar.displayName = '_UserSideBar_';
