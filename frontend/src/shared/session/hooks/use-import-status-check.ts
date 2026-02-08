import React, { useEffect, useMemo } from 'react';
import useLocalStorageState from 'use-local-storage-state';

import type { GetUserResponse } from '#/entities/user';
import { useSocket } from '#/shared/libs/socket';
import { toastImportResponse } from '#/shared/libs/toast/toast-import-response';
import { TokenUtils } from '#/shared/utils/token-utils';

import type { ImportStatusMessage } from '../types';

export const useImportStatusCheck = (user: GetUserResponse | undefined) => {
  const [tasks, setTasks] = useLocalStorageState<string[]>('task', {
    defaultValue: [],
  });

  const token = TokenUtils.getToken();
  const taskId = useMemo(() => tasks[0], [tasks]);
  const endpoint = useMemo(() => {
    if (!token || !taskId) return null;
    return `/ws/import_status/${taskId}?token=${token}`;
  }, [taskId, token]);

  const { lastMessage, send } = useSocket(endpoint ?? '', Boolean(endpoint));

  const removeTask = React.useCallback(() => {
    send('delete');
    setTasks(prev => prev.filter(id => id !== taskId));
  }, [send, setTasks, taskId]);

  useEffect(() => {
    if (!endpoint || user?.role !== 'operator') return;

    const message = lastMessage as ImportStatusMessage | null;
    if (!message) return;

    if ('not_found' in message && message.not_found) {
      setTasks(prev => prev.filter(id => id !== taskId));
      return;
    }
    if ('type' in message && 'result' in message) {
      if (message.type !== 'import_status') return;
      if (message.result?.import_result == null) return;

      toastImportResponse({
        response: message.result.import_result,
        fileName: message.result.file_name,
        onAfterClose: removeTask,
      });
    }
  }, [endpoint, lastMessage, removeTask, send, setTasks, taskId, user?.role]);

  return { removeTask };
};
