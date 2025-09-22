import React from 'react';
import { Outlet } from 'react-router';

import { roleNavigations } from '#/shared/constants/role-navigations';
import { CheckSession } from '#/shared/session';
import { ExpHeader } from '#/widgets/exp-header';
import { Sidebar } from '#/widgets/sidebar';

const OperatorLayout: React.FC = () => {
  return (
    <CheckSession userRole="operator">
      <div className="flex items-start">
        <Sidebar navigations={roleNavigations.operator} />
        <div className="h-full w-full">
          <ExpHeader />
          <Outlet />
        </div>
      </div>
    </CheckSession>
  );
};

export default OperatorLayout;
