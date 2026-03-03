import { toast as tt } from 'react-hot-toast';

import { LucideXIcon } from '#/shared/assets/icons';

import type { ToastProps } from '../toast.types';

export function toast({
  message,
  description,
  type = 'success',
  duration = Infinity,
  actionLabel,
  onAction,
  onClose,
}: ToastProps) {
  tt.custom(
    t => {
      const isSuccess = type === 'success';

      const copyToClipboard = () => {
        const text = description ? `${message}\n${description}` : message;
        navigator.clipboard.writeText(text);
      };

      return (
        <div
          className={`${
            t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
          } max-w-max w-full backdrop-blur-sm bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl pointer-events-auto border border-gray-100/50 overflow-hidden transition-all duration-300`}
        >
          {/* Индикатор типа */}
          <div
            className={`h-1 w-full ${
              isSuccess
                ? 'bg-linear-to-r from-emerald-400 to-teal-400'
                : type === 'warning'
                  ? 'bg-linear-to-r from-amber-400 to-orange-400'
                  : 'bg-linear-to-r from-rose-400 to-pink-400'
            }`}
          />

          <div className="p-3">
            <div className="flex items-start gap-4">
              {/* Иконка */}
              <div
                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSuccess
                    ? 'bg-linear-to-br from-emerald-50 to-teal-50'
                    : type === 'warning'
                      ? 'bg-linear-to-br from-amber-50 to-orange-50'
                      : 'bg-linear-to-br from-rose-50 to-pink-50'
                }`}
              >
                {isSuccess ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-emerald-600"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                ) : type === 'warning' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-amber-600"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-red-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                )}
              </div>

              {/* Контент */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-gray-900 leading-relaxed cursor-pointer hover:text-gray-700 transition-colors select-none block">
                  {message}
                </p>
                {description && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="mt-1.5 text-sm text-left text-gray-600 leading-[130%] cursor-pointer hover:text-gray-800 transition-colors select-none block whitespace-pre-line"
                  >
                    {description}
                  </button>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    title="Скопировать"
                  >
                    Скопировать
                  </button>
                  {actionLabel && onAction && (
                    <button
                      type="button"
                      onClick={() => {
                        onAction();
                        tt.dismiss(t.id, t.toasterId);
                      }}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      title={actionLabel}
                    >
                      {actionLabel}
                    </button>
                  )}
                </div>
              </div>

              {/* Кнопка закрытия */}
              <button
                onClick={() => {
                  tt.dismiss(t.id, t.toasterId);
                  onClose?.();
                }}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 -mr-1 -mt-1"
                title="Закрыть"
              >
                <LucideXIcon style={{ width: 18 }} />
              </button>
            </div>
          </div>
        </div>
      );
    },
    { duration }
  );
}
