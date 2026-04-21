import { createContext, useContext } from 'react';

import type { ISessionContext } from './types';

export const SessionContext = createContext<ISessionContext | null>(null);

export const useSession = <T = ISessionContext>(
  selector?: (context: ISessionContext) => T
): T => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return selector ? selector(context) : (context as unknown as T);
};
