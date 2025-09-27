import type { GetUserResponse } from '#/entities/user/user.types';

import type { SessionRole } from '../types';

export interface ISessionContext {
  user: GetUserResponse | null;
  isLoading: boolean;
}

export interface CheckSessionProps {
  children: React.ReactNode;
  userRole: SessionRole | 'has';
}
