import { toast as tt } from 'react-hot-toast';

import { LucideClipboardIcon, LucideXIcon } from '#/shared/components/icons';

type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

export function toast({
  message,
  description,
  type = 'success',
  duration = Infinity,
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
          } max-w-sm w-full backdrop-blur-sm bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl pointer-events-auto border border-gray-100/50 overflow-hidden transition-all duration-300`}
        >
          {/* Индикатор типа */}
          <div
            className={`h-1 w-full ${
              isSuccess
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                : type === 'warning'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                  : 'bg-gradient-to-r from-rose-400 to-pink-400'
            }`}
          />

          <div className="p-3">
            <div className="flex items-start gap-4">
              {/* Иконка */}
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
                  isSuccess
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50'
                    : type === 'warning'
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50'
                      : 'bg-gradient-to-br from-rose-50 to-pink-50'
                }`}
              >
                {isSuccess ? (
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : type === 'warning' ? (
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-rose-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              {/* Контент */}
              <div className="flex-1 min-w-0 pt-0.5">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={copyToClipboard}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      copyToClipboard();
                    }
                  }}
                  className="text-sm font-semibold text-gray-900 leading-relaxed cursor-pointer hover:text-gray-700 transition-colors select-none block"
                  title="Нажмите для копирования"
                >
                  {message}
                </span>
                {description && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={copyToClipboard}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        copyToClipboard();
                      }
                    }}
                    className="mt-1.5 text-sm text-gray-600 leading-relaxed cursor-pointer hover:text-gray-800 transition-colors select-none block"
                    title="Нажмите для копирования"
                  >
                    {description}
                  </span>
                )}
              </div>

              {/* Кнопка закрытия */}
              <button
                onClick={() => tt.dismiss(t.id, t.toasterId)}
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 -mr-1 -mt-1"
                title="Закрыть"
              >
                <LucideXIcon style={{ width: 18 }} />
              </button>
            </div>

            {/* Действия */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isSuccess
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95'
                    : type === 'warning'
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 active:scale-95'
                      : 'text-rose-700 bg-rose-50 hover:bg-rose-100 active:scale-95'
                }`}
              >
                <LucideClipboardIcon style={{ width: 16 }} />
                Копировать
              </button>
            </div>
          </div>
        </div>
      );
    },
    { duration }
  );
}
