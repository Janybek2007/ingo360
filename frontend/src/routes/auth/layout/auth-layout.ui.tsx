import React from 'react';
import { Outlet } from 'react-router';

import { CheckSession } from '#/shared/session';

const AuthLayout: React.FC = () => {
  return (
    <CheckSession userRole="has">
      <Outlet />
    </CheckSession>
  );
};

export default AuthLayout;
