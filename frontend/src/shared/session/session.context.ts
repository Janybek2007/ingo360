import { createContext, useContext } from 'react';

import type { ISessionContext } from './types';

export const SessionContext = createContext<ISessionContext | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};
