import React from 'react';
import { Outlet } from 'react-router';

import { roleNavigations } from '#/shared/constants/role-navigations';
import { CheckSession } from '#/shared/session';
import { Sidebar } from '#/widgets/sidebar';

const CustomerLayout: React.FC<React.PropsWithChildren> = () => {
  return (
    <CheckSession userRole="customer">
      <div className="flex items-start">
        <Sidebar navigations={roleNavigations.customer} />
        <Outlet />
      </div>
    </CheckSession>
  );
};

export default CustomerLayout;
