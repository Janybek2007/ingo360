import React from 'react';

import type { ReportLog } from '#/entities/report-logs';
import { MdiDeleteIcon } from '#/shared/assets/icons';
import { ConfirmModal } from '#/shared/components/confirm-modal';
import { useToggle } from '#/shared/hooks/use-toggle';

import { useDeleteReportLogMutation } from './delete-report-log.mutation';

export const DeleteReportLogWrapper: React.FC<{ log: ReportLog }> = React.memo(
  ({ log }) => {
    const [deleteModalOpen, { toggle, set }] = useToggle();

    const deleteMutation = useDeleteReportLogMutation();

    return (
      <div className="flex items-center gap-2 pr-10">
        <button
          type="button"
          onClick={toggle}
          className="p-1.5 rounded-full text-red-400 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Удалить"
        >
          <MdiDeleteIcon className="size-[1.125rem]" />
        </button>

        {deleteModalOpen && (
          <ConfirmModal
            title="Удаление лога импорта"
            message={`Вы уверены, что хотите удалить лог импорта от пользователя ${log.user_last_name} ${log.user_first_name}?`}
            confirmText="Удалить"
            cancelText="Отмена"
            confirmAs="danger"
            onConfirm={() => deleteMutation.mutate(log.id)}
            onClose={() => set(false)}
            onCancel={() => set(false)}
            disabled={deleteMutation.isPending}
          />
        )}
      </div>
    );
  }
);

DeleteReportLogWrapper.displayName = '_DeleteReportLogWrapper_';
