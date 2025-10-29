import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';

import { UserQueries } from '#/entities/user/user.queries';
import type { GetUserResponse } from '#/entities/user/user.types';

import { queryClient } from '../libs/react-query';
import { useSocket } from '../libs/socket';

type UserStatusUpdatedMsg =
  | {
      type: 'user_status_updated';
      user_id: number;
      is_active: boolean;
    }
  | {
      type: 'user_updated';
      user: GetUserResponse;
    };

export const useUserStatus = () => {
  const [token] = useState(() => Cookies.get('access_token') || null);

  // NOTE: Adjust endpoint if backend differs, e.g. '/ws/users-status'
  const endpoint = useMemo(() => `/ws/users?token=${token}`, [token]);
  const { lastMessage } = useSocket(endpoint, Boolean(token));

  useEffect(() => {
    const msg = lastMessage as UserStatusUpdatedMsg | null;
    if (!msg) return;

    if (msg.type === 'user_status_updated') {
      const { user_id, is_active } = msg;

      // Update admins/operators list
      queryClient.setQueryData(
        UserQueries.queryKeys.getUsers,
        (prev: GetUserResponse[] | undefined) =>
          Array.isArray(prev)
            ? prev.map(u => (u.id === user_id ? { ...u, is_active } : u))
            : prev
      );

      // Update customers list
      queryClient.setQueryData(
        UserQueries.queryKeys.getCustomers,
        (prev: GetUserResponse[] | undefined) =>
          Array.isArray(prev)
            ? prev.map(u => (u.id === user_id ? { ...u, is_active } : u))
            : prev
      );

      // Update current user if affected
      queryClient.setQueryData(
        UserQueries.queryKeys.getUser,
        (prev: GetUserResponse | null | undefined) =>
          prev && prev.id === user_id ? { ...prev, is_active } : (prev ?? null)
      );
    }

    if (msg.type === 'user_updated') {
      const updated = msg.user;

      queryClient.setQueryData(
        UserQueries.queryKeys.getUsers,
        (prev: GetUserResponse[] | undefined) =>
          Array.isArray(prev)
            ? prev.map(u => (u.id === updated.id ? { ...u, ...updated } : u))
            : prev
      );

      queryClient.setQueryData(
        UserQueries.queryKeys.getCustomers,
        (prev: GetUserResponse[] | undefined) =>
          Array.isArray(prev)
            ? prev.map(u => (u.id === updated.id ? { ...u, ...updated } : u))
            : prev
      );

      queryClient.setQueryData(
        UserQueries.queryKeys.getUser,
        (prev: GetUserResponse | null | undefined) =>
          prev && prev.id === updated.id
            ? { ...prev, ...updated }
            : (prev ?? null)
      );
    }
  }, [lastMessage]);
};
