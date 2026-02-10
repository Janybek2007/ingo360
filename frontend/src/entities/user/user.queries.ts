import { queryOptions } from '@tanstack/react-query';
import qs from 'qs';

import { http } from '#/shared/api';
import type { SessionRole } from '#/shared/types';
import { TokenUtils } from '#/shared/utils/token-utils';

import type {
  GetUserResponse,
  GetUsersParams,
  GetUsersResponse,
} from './user.types';

export class UserQueries {
  static queryKeys = {
    getUser: ['get-user'],
    getUsers: ['get-users'],
    getAdminOperators: (params: GetUsersParams) => [
      'get-admin-operators',
      params,
    ],
    getCustomers: (params: GetUsersParams) => ['get-customers', params],
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

  static GetAdminOperatorsQuery(params: GetUsersParams) {
    return queryOptions({
      queryKey: this.queryKeys.getAdminOperators(params),
      queryFn: async () => {
        const response = await http
          .get('users/admins-operators', {
            searchParams: qs.stringify(params, {
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
    params: GetUsersParams & { enabled: boolean } = { enabled: true }
  ) {
    return queryOptions({
      queryKey: this.queryKeys.getCustomers(params),
      queryFn: async () => {
        const response = await http
          .get('users/clients', {
            searchParams: qs.stringify(params, {
              arrayFormat: 'repeat',
            }),
          })
          .json<GetUsersResponse>();
        return response.map(user => ({
          ...user,
          role: this.buildUserRole(user),
        }));
      },
      enabled: params.enabled,
    });
  }

  private static buildUserRole(user: GetUserResponse): SessionRole {
    if (user.is_admin) return 'administrator';
    if (user.is_operator) return 'operator';
    if (user.is_superuser) return 'superuser';
    return 'customer';
  }
}
