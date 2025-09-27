import { queryOptions } from '@tanstack/react-query';

import { http } from '#/shared/api';

import type { GetUserResponse } from './user.types';

export class UserQueries {
  static queryKeys = {
    getUser: ['get-user'],
  };
  static GetUserQuery() {
    return queryOptions({
      queryKey: this.queryKeys.getUser,
      queryFn: () => {
        return http.get<GetUserResponse>('/api/user');
      },
    });
  }
}
