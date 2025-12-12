import React from 'react';

import { BlockUserWrapper } from '#/features/users/blocked';
import { useSession } from '#/shared/session';

import type { IUserItem } from '../../user.types';

export const UserListItem: React.FC<{ user: IUserItem }> = React.memo(
  ({ user }) => {
    const { user: sessionUser } = useSession();
    const isCurrentUser = sessionUser?.id === user.id;

    const getRoleLabel = React.useCallback(() => {
      if (user.is_superuser) return 'Суперпользователь';
      if (user.is_operator) return 'Оператор';
      if (user.is_admin) return 'Администратор';
      return 'Пользователь';
    }, [user]);

    return (
      <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200">
        <div className="flex flex-wrap gap-2">
          {user.company?.name && (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors duration-150 hover:bg-blue-100">
              {user.company.name}
            </span>
          )}
          {user.position && (
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition-colors duration-150 hover:bg-purple-100">
              {user.position}
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-100">
            {getRoleLabel()}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-base font-semibold text-gray-900 transition-colors duration-150">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-sm text-gray-500 transition-colors duration-150">
            {user.email}
          </p>
        </div>

        {user.is_active ? (
          isCurrentUser ? (
            <div className="w-full rounded-lg bg-blue-50 py-2.5 text-center text-sm font-medium text-blue-600 transition-colors duration-150">
              Это ваш аккаунт
            </div>
          ) : (
            <BlockUserWrapper user={user} />
          )
        ) : (
          <div className="w-full rounded-lg bg-gray-50 py-2.5 text-center text-sm font-medium text-gray-400 transition-colors duration-150">
            Пользователь заблокирован
          </div>
        )}
      </div>
    );
  }
);
UserListItem.displayName = '_UserListItem_';
