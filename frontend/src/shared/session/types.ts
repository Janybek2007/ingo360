import type { GetUserResponse } from '#/entities/user/user.types';

export interface ISessionContext {
  user: GetUserResponse | null;
  isLoading: boolean;
  isWelcomeShown: boolean;
  userAccess: UserAccess | null;
  setIsWelcomeShown: React.Dispatch<React.SetStateAction<boolean>>;
  reconnectSocket: VoidFunction;
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
  access_type?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'visits'
    | 'market-development';
};

export type UserAccess = {
  can_primary_sales: boolean;
  can_secondary_sales: boolean;
  can_tertiary_sales: boolean;
  can_visits: boolean;
  can_market_analysis: boolean;
};
