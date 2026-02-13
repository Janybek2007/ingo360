import React from 'react';
import { createPortal } from 'react-dom';
import { toast as tt } from 'react-hot-toast';

import { ExcelWarningImportContent } from '#/entities/excel';
import { Modal } from '#/shared/components/ui/modal';
import type { TImportResponse } from '#/shared/types/global';

import type { ToastImportResponseProps } from '../toast.types.ts';
import { toast } from './toast.tsx';

const getTotals = (response: TImportResponse) =>
  [
    `Импортировано: ${response.imported}`,
    response.inserted !== null && `Добавлено: ${response.inserted ?? 0}`,
    response.updated !== null && `Обновлено: ${response.updated ?? 0}`,
    response.deduplicated_in_batch !== null &&
      `Найдено дублей в файле (не загружены): ${response.deduplicated_in_batch ?? 0}`,
    `Пропущено: ${response.skipped}`,
    `Всего: ${response.total}`,
  ].filter(Boolean);

const formatSkipped = (records: TImportResponse['skipped_records']) =>
  records.map(record => ({
    label: `row-${record.row}`,
    rows: [record.row],
    missing: record.missing,
  }));

export function toastImportResponse({
  response,
  fileName = 'import',
  duration,
  onRemoveTask,
}: ToastImportResponseProps) {
  const totals = getTotals(response);
  const hasErrors = response.skipped_records.length > 0;
  const errorItems = formatSkipped(response.skipped_records);
  const errorCount = errorItems.length;

  const shortDescription = [...totals, hasErrors ? `Ошибки: ${errorCount}` : '']
    .filter(Boolean)
    .join('\n');

  if (hasErrors) {
    openModal(
      'Импорт завершен с ошибками',
      <ExcelWarningImportContent
        response={response}
        errorItems={errorItems}
        fileName={fileName}
      />,
      onRemoveTask
    );
    return;
  }

  onRemoveTask?.();
  toast({
    message: 'Файл успешно импортирован',
    description: shortDescription,
    type: 'success',
    duration,
  });
}

const openModal = (
  title: string,
  content: string | React.ReactNode,
  onRemoveTask?: VoidFunction
) => {
  tt.custom(
    newToast =>
      createPortal(
        <Modal
          title={title}
          onClose={() => tt.dismiss(newToast.id, newToast.toasterId)}
          classNames={{
            body: 'md:min-w-[60rem] md:max-w-[80rem] min-w-[90dvw] max-w-[90dvw]',
            root: `toast-modal-${newToast.id}`,
          }}
        >
          {typeof content === 'string' ? (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {content}
              </div>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-hidden pr-2">{content}</div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onRemoveTask?.();
                tt.dismiss(newToast.id, newToast.toasterId);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition"
            >
              Закрыть задачу
            </button>
          </div>
        </Modal>,
        document.body
      ),
    { duration: Infinity }
  );
};
