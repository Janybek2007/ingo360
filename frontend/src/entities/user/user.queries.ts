import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { SessionRole } from '#/shared/types';
import { TokenUtils } from '#/shared/utils/token-utils';

import type {
  GetUserResponse,
  GetUsersParams as GetUsersParameters,
  GetUsersResponse,
} from './user.types';

export class UserQueries {
  static readonly queryKeys = {
    getUser: ['get-user'],
    getUsers: ['get-users'],
    getAdminOperators: (parameters: GetUsersParameters) => [
      'get-admin-operators',
      parameters,
    ],
    getCustomers: (parameters: GetUsersParameters) => [
      'get-customers',
      parameters,
    ],
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
        } catch (error) {
          TokenUtils.clearToken();
          throw error;
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

  static GetAdminOperatorsQuery(parameters: GetUsersParameters) {
    return queryOptions({
      queryKey: this.queryKeys.getAdminOperators(parameters),
      queryFn: async () => {
        const response = await http
          .get('users/admins-operators', {
            searchParams: qs.stringify(parameters, {
              arrayFormat: 'repeat',
            }),
          })
          .json<GetUsersResponse>();
        return response.map(user => ({
          ...user,
          role: this.buildUserRole(user),
        }));
      },
    });
  }

  static GetCustomersQuery(
    parameters?: GetUsersParameters & { enabled?: boolean }
  ) {
    const opts = { enabled: true, ...parameters };

    return queryOptions({
      queryKey: this.queryKeys.getCustomers(opts),
      queryFn: async () => {
        const response = await http
          .get('users/clients', {
            searchParams: qs.stringify(opts, {
              arrayFormat: 'repeat',
            }),
          })
          .json<GetUsersResponse>();

        return response.map(user => ({
          ...user,
          role: this.buildUserRole(user),
        }));
      },
      enabled: opts.enabled,
    });
  }

  private static buildUserRole(user: GetUserResponse): SessionRole {
    if (user.is_admin) return 'administrator';
    if (user.is_operator) return 'operator';
    if (user.is_superuser) return 'superuser';
    return 'customer';
  }
}
