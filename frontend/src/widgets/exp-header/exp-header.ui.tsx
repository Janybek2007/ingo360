import React from 'react';
import { useNavigate } from 'react-router';

import { Assets } from '#/shared/assets';
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
            className="w-[2.375rem] h-[2.375rem] cursor-pointer overflow-hidden rounded-full"
          >
            <img
              src={Assets.DefaultAvatar}
              alt="Logo Avatar"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
});

ExpHeader.displayName = '_ExpHeader_';
