import React from 'react';
import { useNavigate } from 'react-router';

import { Assets } from '#/shared/assets';
import { routePaths } from '#/shared/router';

import { HeaderTitle } from './ui/header-title.ui';
import { Notifications } from './ui/notifications.ui';

export const ExpHeader: React.FC = React.memo(() => {
  const navigate = useNavigate();
  return (
    <header
      id="exp-header"
      className="bg-white w-full flex items-center justify-between border-b border-c3 px-6 py-4"
    >
      <HeaderTitle />
      <div className="flex justify-end items-center gap-4">
        <Notifications />

        <div className="group">
          <button
            onClick={() => navigate(routePaths.profile)}
            className="w-[38px] h-[38px] cursor-pointer overflow-hidden rounded-full"
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
