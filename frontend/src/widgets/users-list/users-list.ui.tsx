import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserQueries } from '#/entities/user/user.queries';
import { AsyncBoundary } from '#/shared/components/async-boundry';

export const UsersList: React.FC = React.memo(() => {
  const query = useQuery(UserQueries.GetUsersQuery());
  return (
    <div className="">
      <AsyncBoundary isLoading={query.isLoading} queryError={query.error}>
        <div>Users list</div>
      </AsyncBoundary>
    </div>
  );
});

UsersList.displayName = '_UsersList_';
