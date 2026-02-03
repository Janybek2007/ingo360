/* @react-compiler-disable */
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast as tt } from 'react-hot-toast';

import { Modal } from '#/shared/components/ui/modal';
import type { TImportResponse } from '#/shared/types/global';

import { toast } from './toast';

interface ToastImportResponseProps {
  response: TImportResponse;
  fileName?: string;
  duration?: number;
}

interface ModalContentProps {
  response: TImportResponse;
  errorItems: ImportErrorItem[];
  onCopyErrors: () => void;
  onDownloadErrors: () => void;
}

interface ImportErrorItem {
  label: string;
  rows: number[];
  missing: string[];
}

const getDownloadFileName = (name: string) => {
  const baseName = name.replace(/\.[^/.]+$/, '');
  return `${baseName || 'import'}-errors.txt`;
};

const getTotals = (response: TImportResponse) => [
  `Импортировано: ${response.imported}`,
  `Пропущено: ${response.skipped}`,
  `Всего: ${response.total}`,
];

const formatSkipped = (records: TImportResponse['skipped_records']) =>
  records.map(record => ({
    label: `row-${record.row}`,
    rows: [record.row],
    missing: record.missing,
  }));

const getUniqueMissing = (records: TImportResponse['skipped_records']) => {
  const uniqueMap = new Map<string, string>();

  records.forEach(record => {
    const key = record.missing.join(', ');

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, key);
    }
  });

  return Array.from(uniqueMap.values());
};

export function toastImportResponse({
  response,
  fileName = 'import',
  duration,
}: ToastImportResponseProps) {
  const totals = getTotals(response);
  const hasErrors = response.skipped_records.length > 0;
  const uniqueMissing = getUniqueMissing(response.skipped_records);
  const errorItems = formatSkipped(response.skipped_records);
  const errorCount = uniqueMissing.length;

  const shortDescription = [...totals, hasErrors ? `Ошибки: ${errorCount}` : '']
    .filter(Boolean)
    .join('\n');

  if (hasErrors) {
    const copyErrors = () => {
      const text = uniqueMissing
        .map(missing => `Отсутствует ${missing}`)
        .join('\n');

      navigator.clipboard.writeText(text);
    };

    const downloadErrors = () => {
      const downloadName = getDownloadFileName(fileName);
      const rawLines = uniqueMissing.length
        ? uniqueMissing.map(missing => `- Отсутствует ${missing}`)
        : ['- Ошибки не найдены'];

      const content = [`Файл: ${fileName}`, '', 'Ошибки:', ...rawLines].join(
        '\n'
      );

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      link.click();
      URL.revokeObjectURL(url);
    };

    openModal(
      'Импорт завершен с ошибками',
      <ModalContent
        response={response}
        errorItems={errorItems}
        onCopyErrors={copyErrors}
        onDownloadErrors={downloadErrors}
      />
    );
    return;
  }

  toast({
    message: 'Файл успешно импортирован',
    description: shortDescription,
    type: 'success',
    duration,
  });
}

const ModalContent = ({
  response,
  errorItems,
  onCopyErrors,
  onDownloadErrors,
}: ModalContentProps) => {
  const uniqueMissing = getUniqueMissing(
    errorItems.map(item => ({ row: item.rows[0], missing: item.missing }))
  );
  const listRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: uniqueMissing.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 104,
    overscan: 6,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 rounded-2xl border border-slate-100 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
              Результат импорта
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-800">
              Сводка по файлу импорта
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-2.5 py-1 text-[0.65rem] font-semibold text-rose-600">
            Требуется проверка данных
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
            Импортировано: {response.imported}
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
            Пропущено: {response.skipped}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
            Всего: {response.total}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 text-base font-semibold">
              !
            </span>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-rose-400">
                Ошибки при импорте
              </p>
              <p className="text-xs font-semibold text-rose-700">
                Пожалуйста, проверьте строки перед повторной загрузкой
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onCopyErrors}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 transition"
            >
              Скопировать
            </button>
            <button
              type="button"
              onClick={onDownloadErrors}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-700 transition"
            >
              Скачать .txt
            </button>
          </div>
        </div>
        <div ref={listRef} className="mt-3 max-h-[60dvh] overflow-y-auto pr-1">
          <ul
            className="relative text-sm text-slate-600"
            style={{ height: totalSize }}
          >
            {virtualRows.map(virtualRow => {
              const missing = uniqueMissing[virtualRow.index];

              if (!missing) return null;

              return (
                <li
                  key={missing}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  className="absolute left-0 top-0 w-full pb-2"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <div className="rounded-xl border border-rose-100 bg-white/80 px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold text-slate-600">
                      Отсутствует
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{missing}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const openModal = (title: string, content: string | React.ReactNode) => {
  tt.custom(
    newToast =>
      createPortal(
        <Modal
          title={title}
          onClose={() => tt.dismiss(newToast.id, newToast.toasterId)}
          classNames={{
            body: 'md:min-w-[60rem] md:max-w-[60rem] min-w-[90dvw] max-w-[90dvw]',
            root: `toast-modal-${newToast.id}`,
          }}
        >
          {typeof content === 'string' ? (
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {content}
              </div>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-hidden pr-2">{content}</div>
          )}
        </Modal>,
        document.body
      ),
    { duration: Infinity }
  );
};
