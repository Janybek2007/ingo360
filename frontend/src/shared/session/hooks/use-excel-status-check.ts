import React, { useEffect } from 'react';

import type { GetUserResponse } from '#/entities/user';
import {
  toast,
  toastExportResponse,
  toastImportResponse,
} from '#/shared/libs/toast/toasts';
import { formatDateInUTC } from '#/shared/utils/format-date-in-utc';

import type { NotificationMessage, Task } from '../types';

export const useExcelStatusCheck = (
  user: GetUserResponse | undefined,
  lastMessage: NotificationMessage | null,
  send: (data: string | Record<string, unknown>) => void,
  disconnect: VoidFunction
) => {
  const removeTask = React.useCallback(
    (task_id: string) => send(`task_remove:${task_id}`),
    [send]
  );

  useEffect(() => {
    if (!['administrator', 'operator'].includes(user?.role ?? '')) return;
    if (!lastMessage) return;
    if ('status' in lastMessage && lastMessage.status === 'pending') return;
    handleMessage(lastMessage, removeTask);
  }, [disconnect, lastMessage, removeTask, send, user?.role]);

  return { removeTask };
};

const handleImportToast = (
  result: NotificationMessage['result'] & Task,
  taskId: string,
  removeTask: (id: string) => void
) => {
  const onRemoveTask = createRemoveHandler(removeTask, taskId);
  const createdAt = formatDateInUTC(result.created_at);

  toast({
    message: 'Импорт завершён',
    description: formatToastDescription(
      result?.file_name ?? result.result?.file_name,
      createdAt,
      'Нажмите «Открыть», чтобы посмотреть детали.'
    ),
    type: 'success',
    actionLabel: 'Открыть',
    onAction: () => {
      toastImportResponse({
        response: result.import_result ?? result.result?.import_result,
        fileName:
          (result?.file_name ?? result.result?.file_name) || 'Файл импорта',
        onRemoveTask,
      });
    },
    onClose: onRemoveTask,
  });
};

const handleExportToast = (
  result: NotificationMessage['result'] & Task,
  taskId: string,
  removeTask: (id: string) => void
) => {
  const onRemoveTask = createRemoveHandler(removeTask, taskId);
  const createdAt = formatDateInUTC(result.created_at);
  toast({
    message: 'Экспорт завершён',
    description: formatToastDescription(
      result?.file_name ?? result.result?.file_name,
      createdAt,
      'Нажмите «Открыть», чтобы скачать файл.'
    ),
    type: 'success',
    actionLabel: 'Открыть',
    onAction: () => {
      toastExportResponse({
        taskId,
        fileName:
          (result?.file_name ?? result.result?.file_name) || 'Файл экспорта',
        fileSizeBytes: result.file_size_bytes ?? null,
        onRemoveTask,
      });
    },
    onClose: onRemoveTask,
  });
};

const handleTask = (task: Task, removeTask: (id: string) => void) => {
  if (task.status !== 'completed') return;
  if (task.task_type === 'import') {
    handleImportToast(
      (task.result ?? {}) as NotificationMessage['result'] & Task,
      task.task_id,
      removeTask
    );
  } else if (task.task_type === 'export') {
    handleExportToast(
      task as NotificationMessage['result'] & Task,
      task.task_id,
      removeTask
    );
  }
};

const handleMessage = (
  message: NotificationMessage,
  removeTask: (id: string) => void
) => {
  if (!('type' in message)) return;
  switch (message.type) {
    case 'excel_imported': {
      if ('result' in message && message.result?.import_result != null) {
        handleImportToast(
          message.result as NotificationMessage['result'] & Task,
          message.task_id,
          removeTask
        );
      }
      break;
    }
    case 'excel_exported': {
      if ('result' in message) {
        handleExportToast(
          message.result as NotificationMessage['result'] & Task,
          message.task_id,
          removeTask
        );
      }
      break;
    }
    case 'get_tasks': {
      if (message.tasks) {
        for (const task of message.tasks) {
          handleTask(task, removeTask);
        }
      }
      break;
    }
  }
};

const createRemoveHandler =
  (removeTask: (id: string) => void, taskId: string) => () =>
    removeTask(taskId);

function formatToastDescription(
  fileName?: string,
  createdAt?: string,
  extra?: string
) {
  return [
    fileName ? `Файл: ${fileName}` : null,
    createdAt ? `Создано: ${createdAt}` : null,
    extra,
  ]
    .filter(Boolean)
    .join('\n');
}
