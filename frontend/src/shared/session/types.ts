import type { GetUserResponse } from '#/entities/user/user.types';

export interface ISessionContext {
  user: GetUserResponse | null;
  isLoading: boolean;
  isWelcomeShown: boolean;
  setIsWelcomeShown: React.Dispatch<React.SetStateAction<boolean>>;
  reconnectSocket: VoidFunction;
}

export interface CheckSessionProps {
  children: React.ReactNode;
}
