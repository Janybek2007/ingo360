import React from 'react';

import { LogoutButton } from '#/features/session/logout';
import { SolarUserLinearIcon } from '#/shared/components/icons';
import { useSession } from '#/shared/session';
import { cn } from '#/shared/utils/cn';

import type { IUserSidebarProps, TTabType } from '../profile-content.types';

export const UserSideBar: React.FC<IUserSidebarProps> = React.memo(
  ({ activeTab, setActiveTab }) => {
    const { user } = useSession();

    return (
      <aside className="min-w-[16.625rem] max-w-[16.625rem] max bg-white p-6 rounded-2xl">
        <div className="flex flex-col gap-1 mt-1">
          <h1 className="text-gray-950 font-bold">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-[0.8125rem]">{user?.email}</p>
        </div>
        <div className="flex flex-col items-start gap-2 mt-9">
          {[
            { label: 'Настройка аккаунта', value: 'account-settings' },
            { label: 'Помощь', value: 'help' },
          ].map((tab, i) => (
            <button
              key={i}
              className={cn(
                'w-full py-[0.625rem] px-3 rounded-lg text-medium',
                'flex items-center gap-2',
                activeTab === tab.value && 'bg-[#EEF1F6]'
              )}
              onClick={() => setActiveTab(tab.value as TTabType)}
            >
              <SolarUserLinearIcon className="size-[1rem] text-[#333D4C]" />
              <span className="text-[#333D4C] font-inter text-sm font-medium leading-5">
                {tab.label}
              </span>
            </button>
          ))}
          <LogoutButton />
        </div>
      </aside>
    );
  }
);

UserSideBar.displayName = '_UserSideBar_';
