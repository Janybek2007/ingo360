import type { GetUserResponse, UserAccess } from '#/entities/user/user.types';

export interface ISessionContext {
  user: GetUserResponse | null;
  isLoading: boolean;
  isWelcomeShown: boolean;
  userAccess: UserAccess | null;
  setIsWelcomeShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CheckSessionProps {
  children: React.ReactNode;
}

export type NotificationType =
  | 'token_invalidated'
  | 'account_deactivated'
  | 'company_deactivated'
  | 'company_access_revoked';

export type NotificationMessage = {
  type: NotificationType;
  message: string;
  access_type?: 'primary' | 'secondary' | 'tertiary' | 'visits' | 'market';
};
