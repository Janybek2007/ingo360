import React from 'react';
import { Outlet } from 'react-router';

import { roleNavigations } from '#/shared/constants/role-navigations';
import { CheckSession } from '#/shared/session';
import { ExpHeader } from '#/widgets/exp-header';
import { Sidebar } from '#/widgets/sidebar';

const CustomerLayout: React.FC<React.PropsWithChildren> = () => {
  return (
    <CheckSession userRole="customer">
      <div className="flex items-start">
        <Sidebar navigations={roleNavigations.customer} />
        <div className="h-full w-full">
          <ExpHeader />
          <Outlet />
        </div>
      </div>
    </CheckSession>
  );
};

export default CustomerLayout;
