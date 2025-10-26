import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';

import { SessionContext } from './session.context';
import type { ISessionContext } from './types';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, isLoading } = useQuery(UserQueries.GetUserQuery());
  const [isWelcomeShown, setIsWelcomeShown] = useState(false);

  const session: ISessionContext = {
    user: data ?? null,
    isLoading,
    isWelcomeShown,
    setIsWelcomeShown,
  };

  return (
    <SessionContext.Provider value={session}>
      {isLoading ? '' : children}
    </SessionContext.Provider>
  );
};
