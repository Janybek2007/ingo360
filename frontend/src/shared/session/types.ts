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
  | 'company_access_revoked'
  | 'excel_imported'
  | 'excel_exported'
  | 'get_tasks';

type TaskStatus = 'completed' | 'pending' | 'failed';

export type NotificationMessage = {
  type: NotificationType;
  message: string;
  access_type: 'primary' | 'secondary' | 'tertiary' | 'visits' | 'market';
  //
  status: 'completed' | 'pending' | 'failed';
  task_id: string;
  result: {
    file_name: string;
    import_result: TImportResponse;
    file_size_bytes: number | null;
    created_at: string;
  };
  //
  count: number;
  tasks: Array<Task>;
};

export interface Task {
  task_id: string;
  id: number;
  status: TaskStatus;
  file_name: string;
  created_at: string;
  result?: {
    file_name: string;
    import_result: TImportResponse;
  };
  task_type: 'export' | 'import';
  file_size_bytes?: number | null;
}
