import React from 'react';
import { useNavigate } from 'react-router';

import { SolarUserLinearIcon } from '#/shared/assets/icons';
import { routePaths } from '#/shared/router';

import { Notifications } from './ui/notifications.ui';

export const ExpHeader: React.FC = React.memo(() => {
  const navigate = useNavigate();

  return (
    <header
      id="exp-header"
      className="bg-white w-full max-h-[4.875rem] min-h-[4.875rem] flex items-center justify-end border-b border-c3 px-6 py-4"
    >
      <div className="flex justify-end items-center gap-4">
        <Notifications />

        <div className="group">
          <button
            onClick={() => navigate(routePaths.profile)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#333D4C] transition-colors hover:bg-[#EEF1F6]"
          >
            <SolarUserLinearIcon className="size-[1.25rem] text-[#333D4C]" />
            <span>Профиль</span>
          </button>
        </div>
      </div>
    </header>
  );
});

ExpHeader.displayName = '_ExpHeader_';
