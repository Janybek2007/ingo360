import React from 'react';
import { Outlet } from 'react-router';

import { ScrollToTopButton } from '#/shared/components/scroll-to-top';
import { ReactQueryProvider } from '#/shared/libs/react-query';
import { ToastProvider } from '#/shared/libs/toast/toast.provider.ui';
import { SessionProvider } from '#/shared/session';

const RootLayout: React.FC = () => {
  return (
    <ReactQueryProvider>
      <SessionProvider>
        <ToastProvider />
        <Outlet />
        <ScrollToTopButton />
      </SessionProvider>
    </ReactQueryProvider>
  );
};

export default RootLayout;
