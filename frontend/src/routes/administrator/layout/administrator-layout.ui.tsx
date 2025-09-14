import React from 'react';
import { Outlet } from 'react-router';

import { roleNavigations } from '#/shared/constants/role-navigations';
import { CheckSession } from '#/shared/session';
import { Sidebar } from '#/widgets/sidebar';

const AdministratorLayout: React.FC = () => {
  return (
    <CheckSession userRole="administrator">
      <div className="flex items-start">
        <Sidebar navigations={roleNavigations.administrator} />
        <Outlet />
      </div>
    </CheckSession>
  );
};

export default AdministratorLayout;
