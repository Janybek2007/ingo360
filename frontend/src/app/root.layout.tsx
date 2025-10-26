import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import React from 'react';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

import { Effect } from '#/shared/components/effect';
import { WelcomeMessage } from '#/shared/components/welcome-message';
import { ReactQueryProvider } from '#/shared/libs/react-query';
import { SessionProvider } from '#/shared/session';

const RootLayout: React.FC = () => {
  return (
    <ReactQueryProvider>
      <NuqsAdapter>
        <SessionProvider>
          <Effect />
          <WelcomeMessage />
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            duration={5000}
            theme="light"
          />
          <Outlet />
        </SessionProvider>
      </NuqsAdapter>
    </ReactQueryProvider>
  );
};

export default RootLayout;
