import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useRef } from 'react';

import type { ModalContentProps } from '../excel.types';

const getDownloadFileName = (name: string) => {
  const baseName = name.replace(/\.[^/.]+$/, '');
  return `${baseName || 'import'}-errors.txt`;
};

export const ExcelWarningImportContent = ({
  response,
  errorItems,
  fileName,
}: ModalContentProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  const onCopyErrors = React.useCallback(() => {
    const text = errorItems
      .map(
        item =>
          `row-${item.rows.join(', ')}: отсутствует ${item.missing.join(', ')}`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
  }, [errorItems]);

  const onDownloadErrors = React.useCallback(() => {
    const downloadName = getDownloadFileName(fileName);
    const rawLines = errorItems.length
      ? errorItems.map(
          item =>
            `- row-${item.rows.join(', ')}: отсутствует ${item.missing.join(', ')}`
        )
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
  }, [errorItems, fileName]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: errorItems.length,
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
              Сводка по файлу импорта | {fileName}
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-2.5 py-1 text-[0.65rem] font-semibold text-rose-600">
            Требуется проверка данных
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
            Файл: {fileName || 'export.xlsx'}
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
            Импортировано: {response.imported}
          </span>
          {!!response.inserted && (
            <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
              Добавлено: {response.inserted ?? 0}
            </span>
          )}
          {!!response.updated && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
              Обновлено: {response.updated ?? 0}
            </span>
          )}
          {!!response.deduplicated_in_batch && (
            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-700">
              Найдено дублей в файле (не загружены):{' '}
              {response.deduplicated_in_batch ?? 0}
            </span>
          )}
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
        <div ref={listRef} className="mt-3 max-h-[40vh] overflow-y-auto pr-1">
          <ul
            className="relative text-sm text-slate-600"
            style={{ height: totalSize }}
          >
            {virtualRows.map(virtualRow => {
              const item = errorItems[virtualRow.index];

              if (!item) return null;

              return (
                <li
                  key={item.label}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  className="absolute left-0 top-0 w-full pb-2"
                  style={{ transform: `translateY(${virtualRow.start}px)` }}
                >
                  <div className="rounded-xl border border-rose-100 bg-white/80 px-4 py-3 shadow-sm">
                    <p className="text-xs font-semibold text-slate-600">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      Отсутствует {item.missing.join(', ')}
                    </p>
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
