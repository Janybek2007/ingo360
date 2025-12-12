import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserListItem } from '#/entities/user/ui/user-list-item/user-list-item.ui';
import { UserQueries } from '#/entities/user/user.queries';
import { AsyncBoundary } from '#/shared/components/async-boundry';

export const UsersList: React.FC = React.memo(() => {
  const query = useQuery(UserQueries.GetUsersQuery());

  const sortedUsers = React.useMemo(() => {
    if (!query.data) return [];

    return [...query.data].sort((a, b) => {
      const getRolePriority = (user: typeof a) => {
        if (user.is_superuser) return 0;
        if (user.is_admin) return 1;
        if (user.is_operator) return 2;
        return 3;
      };

      return getRolePriority(a) - getRolePriority(b);
    });
  }, [query.data]);

  return (
    <div className="container mx-auto max-w-2xl px-3 py-4">
      <AsyncBoundary isLoading={query.isLoading} queryError={query.error}>
        <div className="flex max-h-[calc(100vh-8rem)] flex-col gap-3 overflow-y-auto">
          {sortedUsers.map((user, index) => (
            <div
              key={user.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <UserListItem user={user} />
            </div>
          ))}
        </div>
      </AsyncBoundary>
    </div>
  );
});

UsersList.displayName = '_UsersList_';
