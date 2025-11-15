import React from 'react';

import { UserSettings } from './contents/user-settings';
import type { TTabType } from './profile-content.types';
import { UserSideBar } from './ui/user-sidebar.ui';

export const ProfileContent: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] =
    React.useState<TTabType>('account-settings');
  return (
    <section>
      <div className="flex items-start gap-6">
        <UserSideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'account-settings' && <UserSettings />}
      </div>
    </section>
  );
});

ProfileContent.displayName = '_ProfileContent_';
