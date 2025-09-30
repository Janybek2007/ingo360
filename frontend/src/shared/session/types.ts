import type { GetUserResponse } from '#/entities/user/user.types';

export interface ISessionContext {
  user: GetUserResponse | null;
  isLoading: boolean;
}

export interface CheckSessionProps {
  children: React.ReactNode;
}
