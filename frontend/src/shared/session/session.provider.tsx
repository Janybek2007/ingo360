import React from 'react';

import { SessionContext } from './session.context';
import type { ISessionContext } from './types';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const session: ISessionContext = {
    user: { role: 'customer' },
    isLoading: false,
  };

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
