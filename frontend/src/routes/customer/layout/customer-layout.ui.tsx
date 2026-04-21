import React from 'react';
import { Outlet } from 'react-router';

import { CheckSession } from '#/shared/session';
import { ExpHeader } from '#/widgets/exp-header';
import { Sidebar } from '#/widgets/sidebar';

const CustomerLayout: React.FC<React.PropsWithChildren> = () => {
  return (
    <CheckSession>
      <div className="flex items-start">
        <Sidebar />
        <div className="h-full w-full">
          <ExpHeader />
          <Outlet />
        </div>
      </div>
    </CheckSession>
  );
};

export default CustomerLayout;
