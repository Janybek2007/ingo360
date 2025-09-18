import React from 'react';
import { Outlet } from 'react-router';

import { SessionProvider } from '#/shared/session';

const RootLayout: React.FC = () => {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
};

export default RootLayout;
