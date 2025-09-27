import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';
import type { SessionRole } from '#/shared/types';

import type { GetUserResponse } from './user.types';

export class UserQueries {
  static queryKeys = {
    getUser: ['get-user'],
  };

  static GetUserQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getUser,
      queryFn: async () => {
        const response = await http.get('users/me').json<GetUserResponse>();
        return {
          ...response,
          role: 'customer',
        };
      },
    });
  }

  private static buildUserRole(user: GetUserResponse): SessionRole {
    if (user.is_admin) return 'administrator';
    if (user.is_staff) return 'operator';
    return 'customer';
  }
}
