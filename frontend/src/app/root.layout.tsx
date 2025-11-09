import React from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

import { ScrollToTopButton } from '#/shared/components/scroll-to-top';
import { ReactQueryProvider } from '#/shared/libs/react-query';
import { SessionProvider } from '#/shared/session';

const RootLayout: React.FC = () => {
  return (
    <ReactQueryProvider>
      <SessionProvider>
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={5000}
          theme="light"
        />
        <Outlet />
        <ScrollToTopButton />
      </SessionProvider>
    </ReactQueryProvider>
  );
};

export default RootLayout;
