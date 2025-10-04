import React from 'react';

import { Assets } from '#/shared/assets';
import { Icon } from '#/shared/components/ui/icon';
import { useSession } from '#/shared/session';
import { cn } from '#/shared/utils/cn';

import type { TTabType } from '../profile-content.ui';

interface IUserSidebarProps {
  activeTab: TTabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TTabType>>;
}

export const UserSideBar: React.FC<IUserSidebarProps> = React.memo(
  ({ activeTab, setActiveTab }) => {
    const { user } = useSession();
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
            <h1 className="text-gray-950 font-bold">
              {user?.first_name} {user?.last_name}
            </h1>
            {/* USERS EMAIL  */}
            <p className="text-[13px]">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 mt-9">
          {[
            {
              label: 'Настройка аккаунта',
              value: 'account-settings',
              icon: 'solar:user-linear',
            },
            { label: 'Помощь', value: 'help', icon: 'solar:user-linear' },
            { label: 'Выйти', value: 'exit', icon: 'mynaui:logout' },
          ].map((tab, i) => (
            <button
              key={i}
              className={cn(
                'w-full py-[10px] px-3 rounded-lg text-medium',
                'flex items-center gap-2',
                activeTab === tab.value && 'bg-[#EEF1F6]'
              )}
              onClick={() => setActiveTab(tab.value as TTabType)}
            >
              <Icon name={tab.icon} size={16} color="#333D4C" />
              <span className="text-[#333D4C] font-inter text-sm font-medium leading-5">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </aside>
    );
  }
);

UserSideBar.displayName = '_UserSideBar_';
