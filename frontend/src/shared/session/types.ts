import type { GetUserResponse, UserAccess } from '#/entities/user';

import type { TImportResponse } from '../types/global';

export interface ISessionContext {
  user: GetUserResponse | null;
  isLoading: boolean;
  isWelcomeShown: boolean;
  userAccess: UserAccess | null;
  setIsWelcomeShown: React.Dispatch<React.SetStateAction<boolean>>;
}

//
export type NotificationType =
  | 'token_invalidated'
  | 'account_deactivated'
  | 'company_deactivated'
  | 'company_access_revoked';

export type NotificationMessage = {
  type: NotificationType;
  message: string;
  access_type: 'primary' | 'secondary' | 'tertiary' | 'visits' | 'market';
};

export type ImportStatusMessage =
  | { not_found: true }
  | {
      type: 'import_status';
      task_id: string;
      result: { file_name: string; import_result: TImportResponse };
    };
