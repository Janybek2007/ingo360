import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { DbQueries } from '#/entities/db';
import { UserQueries } from '#/entities/user';

import { WelcomeMessage } from '../components/welcome-message';
import { useViewportEffect } from '../hooks/use-viewport-effect';
import { useExcelStatusCheck } from './hooks/use-excel-status-check';
import { useNotifications } from './hooks/use-notifications';
import { useUserAccess } from './hooks/use-user-access';
import { SessionContext } from './session.context';
import type { ISessionContext } from './types';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, isLoading } = useQuery(UserQueries.GetUserQuery());
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);
  const { lastMessage, disconnect, send } = useNotifications(isWelcomeShown);
  const userAccess = useUserAccess(lastMessage, data);
  const lastYear = useQuery(DbQueries.GetLastYear(data?.role === 'customer'));

  useExcelStatusCheck(data, lastMessage, send, disconnect);

  useViewportEffect();

  const session: ISessionContext = {
    user: data ?? null,
    isLoading,
    isWelcomeShown,
    setIsWelcomeShown,
    lastYear: lastYear.data,
    userAccess,
  };

  return (
    <SessionContext.Provider value={session}>
      {isWelcomeShown && <WelcomeMessage />}
      {children}
    </SessionContext.Provider>
  );
};
