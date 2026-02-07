import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';
import type { SessionRole } from '#/shared/types';
import { TokenUtils } from '#/shared/utils/token-utils';

import type { GetUserResponse, GetUsersResponse } from './user.types';

export class UserQueries {
  static queryKeys = {
    getUser: ['get-user'],
    getUsers: ['get-users'],
    getAdminOperators: ['get-admin-operators'],
    getCustomers: ['get-customers'],
  };

  static GetUserQuery() {
    return queryOptions<GetUserResponse>({
      queryKey: this.queryKeys.getUser,
      queryFn: async () => {
        try {
          const response = await http.get('users/me').json<GetUserResponse>();
          return {
            ...response,
            role: this.buildUserRole(response),
          };
        } catch (err) {
          TokenUtils.clearToken();
          throw err;
        }
      },
    });
  }

  static GetUsersQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getUsers,
      queryFn: async () => {
        const response = await http.get('users').json<GetUsersResponse>();
        return response.map(user => ({
          ...user,
          role: this.buildUserRole(user),
        }));
      },
    });
  }

  static GetAdminOperatorsQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getAdminOperators,
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

  static GetCustomersQuery(enabled = true) {
    return queryOptions({
      queryKey: this.queryKeys.getCustomers,
      queryFn: async () => {
        const response = await http
          .get('users/clients')
          .json<GetUsersResponse>();
        return response.map(user => ({
          ...user,
          role: this.buildUserRole(user),
        }));
      },
      enabled,
    });
  }

  private static buildUserRole(user: GetUserResponse): SessionRole {
    if (user.is_admin) return 'administrator';
    if (user.is_operator) return 'operator';
    if (user.is_superuser) return 'superuser';
    return 'customer';
  }
}
