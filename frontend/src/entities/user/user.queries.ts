import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';
import type { SessionRole } from '#/shared/types';

import type { GetUserResponse, GetUsersResponse } from './user.types';

export class UserQueries {
  static queryKeys = {
    getUser: ['get-user'],
    getUsers: ['get-users'],
    getCustomers: ['get-customers'],
  };

  static GetUserQuery() {
    return queryOptions<GetUserResponse>({
      queryKey: this.queryKeys.getUser,
      // queryFn: async () => {
      //   const response = await http.get('users/me').json<GetUserResponse>();
      //   return {
      //     ...response,
      //     role: this.buildUserRole(response),
      //   };
      // },
      queryFn: async () => {
        const response = await http.get('users/me').json<GetUserResponse>();
        return {
          ...response,
          role: 'customer' as SessionRole,
        };
      },
    });
  }

  static GetUsersQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getUsers,
      queryFn: async () => {
        const response = await http
          .get('users/admins-operators')
          .json<GetUsersResponse>();
        return response.map(user => ({
          ...user,
          role: this.buildUserRole(user),
        }));
      },
    });
  }

  static GetCustomersQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getCustomers,
      queryFn: async () => {
        const response = await http.get('users').json<GetUsersResponse>();
        return response.map(user => ({
          ...user,
          role: this.buildUserRole(user),
        }));
      },
    });
  }

  private static buildUserRole(user: GetUserResponse): SessionRole {
    if (user.is_admin) return 'administrator';
    if (user.is_operator) return 'operator';
    return 'customer';
  }
}
