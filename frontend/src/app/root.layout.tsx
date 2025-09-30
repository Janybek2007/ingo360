import React from 'react';
import { Outlet } from 'react-router';

import { ReactQueryProvider } from '#/shared/libs/react-query';
import { SessionProvider } from '#/shared/session';

const RootLayout: React.FC = () => {
  return (
    <ReactQueryProvider>
      <SessionProvider>
        <Outlet />
      </SessionProvider>
    </ReactQueryProvider>
  );
};

export default RootLayout;
