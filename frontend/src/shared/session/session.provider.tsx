import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserQueries } from '#/entities/user/user.queries';

import { SessionContext } from './session.context';
import type { ISessionContext } from './types';

export const SessionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const queryData = useQuery(UserQueries.GetUserQuery());

  const session: ISessionContext = {
    user: queryData.data || null,
    isLoading: queryData.isLoading,
  };

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
