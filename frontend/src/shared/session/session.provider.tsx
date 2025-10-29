import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';

import { WelcomeMessage } from '../components/welcome-message';
import { useNotifications } from './hooks/use-notifications';
import { SessionContext } from './session.context';
import type { ISessionContext } from './types';
import { useInvalidateToken } from './use-invalidate-token';
import { useUserStatus } from './use-user-status';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, isLoading } = useQuery(UserQueries.GetUserQuery());
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);
  useInvalidateToken();
  useUserStatus();
  const { reconnect } = useNotifications();

  const session: ISessionContext = {
    user: data ?? null,
    isLoading,
    isWelcomeShown,
    setIsWelcomeShown,
    reconnectSocket: reconnect,
  };

  return (
    <SessionContext.Provider value={session}>
      {isWelcomeShown && <WelcomeMessage />}
      {children}
    </SessionContext.Provider>
  );
};
