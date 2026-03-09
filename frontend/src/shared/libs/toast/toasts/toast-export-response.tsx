import { createPortal } from 'react-dom';
import { toast as tt } from 'react-hot-toast';

import { DownloadExcelModalContent } from '#/features/excel/download';

import type { ToastExportResponseProps as ToastExportResponseProperties } from '../toast.types.ts';

export function toastExportResponse({
  taskId,
  fileName = 'export.xlsx',
  fileSizeBytes,
  duration = Infinity,
  onRemoveTask,
}: ToastExportResponseProperties) {
  tt.custom(
    newToast =>
      createPortal(
        <DownloadExcelModalContent
          taskId={taskId}
          fileName={fileName}
          fileSizeBytes={fileSizeBytes}
          onClose={() => tt.dismiss(newToast.id, newToast.toasterId)}
          onRemoveTask={() => {
            onRemoveTask?.();
            tt.dismiss(newToast.id, newToast.toasterId);
          }}
        />,
        document.body
      ),
    { duration: duration }
  );
}
