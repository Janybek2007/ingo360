import React from 'react';

import { LogoutButton } from '#/features/session/logout';
import { SolarUserLinearIcon } from '#/shared/assets/icons';
import { useSession } from '#/shared/session';
import { cn } from '#/shared/utils/cn';

import type {
  IUserSidebarProps as IUserSidebarProperties,
  TTabType,
} from '../profile-content.types';

export const UserSideBar: React.FC<IUserSidebarProperties> = React.memo(
  ({ activeTab, setActiveTab }) => {
    const { user } = useSession();

    return (
      <aside className="max max-w-[16.625rem] min-w-[16.625rem] rounded-2xl bg-white p-6">
        <div className="mt-1 flex flex-col gap-1">
          <h1 className="font-bold text-gray-950">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-[0.8125rem]">{user?.email}</p>
        </div>
        <div className="mt-9 flex flex-col items-start gap-2">
          {[
            { label: 'Настройка аккаунта', value: 'account-settings' },
            { label: 'Помощь', value: 'help' },
          ].map((tab, index) => (
            <button
              key={index}
              className={cn(
                'text-medium w-full rounded-lg px-3 py-[0.625rem]',
                'flex items-center gap-2',
                activeTab === tab.value && 'bg-[#EEF1F6]'
              )}
              onClick={() => setActiveTab(tab.value as TTabType)}
            >
              <SolarUserLinearIcon className="size-[1rem] text-[#333D4C]" />
              <span className="font-inter text-sm leading-5 font-medium text-[#333D4C]">
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
