import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';

import { WelcomeMessage } from '../components/welcome-message';
import { useViewportEffect } from '../hooks/use-viewport-effect';
import { useNotifications } from './hooks/use-notifications';
import { useUserAccess } from './hooks/use-user-access';
import { SessionContext } from './session.context';
import type { ISessionContext } from './types';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, isLoading } = useQuery(UserQueries.GetUserQuery());
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);
  const { lastMessage } = useNotifications(isWelcomeShown);
  const userAccess = useUserAccess(lastMessage, data);

  useViewportEffect();

  const session: ISessionContext = {
    user: data ?? null,
    isLoading,
    isWelcomeShown,
    setIsWelcomeShown,
    userAccess,
  };

  return (
    <SessionContext.Provider value={session}>
      {isWelcomeShown && <WelcomeMessage />}
      {children}
    </SessionContext.Provider>
  );
};
