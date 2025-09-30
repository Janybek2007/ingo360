import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserQueries } from '#/entities/user/user.queries';

import { SessionContext } from './session.context';
import type { ISessionContext } from './types';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { data, isLoading } = useQuery(UserQueries.GetUserQuery());

  const session: ISessionContext = {
    user: data ?? null,
    isLoading,
  };

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
