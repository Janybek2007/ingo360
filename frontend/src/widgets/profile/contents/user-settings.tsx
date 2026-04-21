import React from 'react';

import { ProfilePassword } from '#/features/profile/password';
import { ProfilePersonalData } from '#/features/profile/personal-data';
import { Tabs } from '#/shared/components/ui/tabs';

export const UserSettings: React.FC = React.memo(() => {
  return (
    <div className="h-max w-full rounded-2xl bg-white p-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Настройки аккаунта</h2>
      </div>
      <Tabs
        classNames={{
          root: 'mt-8',
          tabs: 'p-0 rounded-none border-none',
          content: 'w-full',
          tab: 'border border-c3__1',
        }}
        items={[
          { value: 'personal-data', label: 'Персональные данные' },
          { value: 'password', label: 'Пароль' },
        ]}
      >
        {({ current }) => {
          switch (current) {
            case 'personal-data': {
              return <ProfilePersonalData />;
            }
            case 'password': {
              return <ProfilePassword />;
            }
          }
        }}
      </Tabs>
    </div>
  );
});

UserSettings.displayName = '_UserSettings_';
