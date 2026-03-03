import React, { useEffect } from 'react';

import type { GetUserResponse } from '#/entities/user';
import {
  toast,
  toastExportResponse,
  toastImportResponse,
} from '#/shared/libs/toast/toasts';
import { formatDateInUTC } from '#/shared/utils/format_date_in_utc';

import type { NotificationMessage } from '../types';

export const useExcelStatusCheck = (
  user: GetUserResponse | undefined,
  lastMessage: NotificationMessage | null,
  send: (data: string | Record<string, unknown>) => void,
  disconnect: VoidFunction
) => {
  const removeTask = React.useCallback(
    (task_id: string) => {
      send(`task_remove:${task_id}`);
    },
    [send]
  );

  useEffect(() => {
    if (user?.role !== 'operator') return;

    const message = lastMessage;
    if (!message) return;
    if ('status' in message && message.status == 'pending') return;

    if ('type' in message) {
      if (message.type === 'excel_imported' && 'result' in message) {
        if (message.result?.import_result == null) return;

        const createdAt = formatDateInUTC(message.result.created_at);
        toast({
          message: 'Импорт завершён',
          description: [
            `Файл: ${message.result?.file_name}`,
            createdAt ? `Создано: ${createdAt}` : null,
            'Нажмите «Открыть», чтобы посмотреть детали.',
          ]
            .filter(Boolean)
            .join('\n'),
          type: 'success',
          actionLabel: 'Открыть',
          onAction: () => {
            toastImportResponse({
              response: message.result.import_result,
              fileName: message.result?.file_name || 'Файл импорта',
              onRemoveTask: () => removeTask(message.task_id),
            });
          },
          onClose: () => removeTask(message.task_id),
        });
        return;
      }

      if (message.type === 'excel_exported' && 'result' in message) {
        const createdAt = formatDateInUTC(message.result.created_at);
        toast({
          message: 'Экспорт завершён',
          description: [
            message.result.file_name
              ? `Файл: ${message.result.file_name}`
              : null,
            createdAt ? `Создано: ${createdAt}` : null,
            'Нажмите «Открыть», чтобы скачать файл.',
          ]
            .filter(Boolean)
            .join('\n'),
          type: 'success',
          actionLabel: 'Открыть',
          onAction: () => {
            toastExportResponse({
              taskId: message.task_id,
              fileName: message.result.file_name || 'Файл экспорта',
              fileSizeBytes: message.result.file_size_bytes,
              onRemoveTask: () => removeTask(message.task_id),
            });
          },
          onClose: () => removeTask(message.task_id),
        });

        return;
      }

      if (message.type === 'get_tasks') {
        message.tasks.forEach(task => {
          if (task.status !== 'completed') return;

          if (task.task_type === 'import') {
            const createdAt = formatDateInUTC(task.created_at);
            toast({
              message: 'Импорт завершён',
              description: [
                task.result?.file_name || task.file_name
                  ? `Файл: ${task.result?.file_name || task.file_name}`
                  : null,
                createdAt ? `Создано: ${createdAt}` : null,
                'Нажмите «Открыть», чтобы посмотреть детали.',
              ]
                .filter(Boolean)
                .join('\n'),
              type: 'success',
              actionLabel: 'Открыть',
              onClose: () => removeTask(task.task_id),
              onAction: () => {
                toastImportResponse({
                  response: task.result?.import_result ?? {
                    total: 0,
                    skipped: 0,
                    imported: 0,
                    inserted: 0,
                    updated: 0,
                    deduplicated_in_batch: 0,
                    skipped_records: [],
                  },
                  fileName:
                    task.result?.file_name || task.file_name || 'Файл импорта',
                  onRemoveTask: () => removeTask(task.task_id),
                });
              },
            });
            return;
          }

          if (task.task_type === 'export') {
            const createdAt = formatDateInUTC(task.created_at);
            toast({
              message: 'Экспорт завершён',
              description: [
                task.file_name ? `Файл: ${task.file_name}` : null,
                createdAt ? `Создано: ${createdAt}` : null,
                'Нажмите «Открыть», чтобы скачать файл.',
              ]
                .filter(Boolean)
                .join('\n'),
              type: 'success',
              actionLabel: 'Открыть',
              onClose: () => removeTask(task.task_id),
              onAction: () => {
                toastExportResponse({
                  taskId: task.task_id,
                  fileName: task.file_name || 'Файл экспорта',
                  fileSizeBytes: task.file_size_bytes ?? null,
                  onRemoveTask: () => removeTask(task.task_id),
                });
              },
            });
          }
        });
      }
    }
  }, [disconnect, lastMessage, removeTask, send, user?.role]);

  return { removeTask };
};
