import React from 'react';

import { Modal } from '#/shared/components/ui/modal';

import { useDownloadExcelMutation } from './download-excel.mutation';

type DownloadExcelModalContentProperties = {
  taskId: string;
  fileName?: string;
  fileSizeBytes?: number | null;
  onClose: VoidFunction;
  onRemoveTask?: VoidFunction;
};

const formatFileSize = (sizeBytes?: number | null) => {
  if (!sizeBytes) return null;

  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  let value = sizeBytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value < 10 && unitIndex > 0 ? 1 : 0)} ${
    units[unitIndex]
  }`;
};

export const DownloadExcelModalContent: React.FC<DownloadExcelModalContentProperties> =
  React.memo(({ taskId, fileName, fileSizeBytes, onClose, onRemoveTask }) => {
    const { mutateAsync, isPending } = useDownloadExcelMutation();
    const sizeLabel = formatFileSize(fileSizeBytes);

    const handleDownload = React.useCallback(async () => {
      const response = await mutateAsync({ taskId });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'export.xlsx';
      link.click();
      URL.revokeObjectURL(url);
    }, [fileName, mutateAsync, taskId]);

    return (
      <Modal
        title="Файл готов"
        onClose={() => {
          onClose();
          onRemoveTask?.();
        }}
        classNames={{
          body: 'md:min-w-[40rem] md:max-w-[60rem] min-w-[70dvw] max-w-[70dvw]',
        }}
      >
        <div className="space-y-4">
          <div className="sticky top-0 z-10 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.65rem] tracking-[0.18em] text-slate-400 uppercase">
                  Экспорт завершён
                </p>
                <h3 className="mt-1 text-base font-semibold text-slate-800">
                  Сводка по экспорту файла
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-600">
                Файл готов
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                Файл: {fileName || 'export.xlsx'}
              </span>
              {sizeLabel && (
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
                  Размер: {sizeLabel}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-base font-semibold text-emerald-600">
                  ✓
                </span>
                <div>
                  <p className="text-[0.65rem] tracking-[0.18em] text-emerald-400 uppercase">
                    Файл подготовлен
                  </p>
                  <p className="text-xs font-semibold text-emerald-700">
                    Можно скачать файл
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRemoveTask?.();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:bg-slate-100"
                >
                  Закрыть
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 active:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? 'Скачивание...' : 'Скачать'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  });

DownloadExcelModalContent.displayName = '_DownloadExcelModalContent_';
