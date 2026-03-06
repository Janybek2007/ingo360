import { toast as tt } from 'react-hot-toast';

import { LucideXIcon } from '#/shared/assets/icons';

import type { ToastProps as ToastProperties } from '../toast.types';

// Добавить выше tt.custom(...)

const getIndicatorClass = (
  type: ToastProperties['type'],
  isSuccess: boolean
): string => {
  if (isSuccess) return 'bg-linear-to-r from-emerald-400 to-teal-400';
  if (type === 'warning') return 'bg-linear-to-r from-amber-400 to-orange-400';
  return 'bg-linear-to-r from-rose-400 to-pink-400';
};

const getIconWrapperClass = (
  type: ToastProperties['type'],
  isSuccess: boolean
): string => {
  if (isSuccess) return 'bg-linear-to-br from-emerald-50 to-teal-50';
  if (type === 'warning') return 'bg-linear-to-br from-amber-50 to-orange-50';
  return 'bg-linear-to-br from-rose-50 to-pink-50';
};

const getIcon = (
  type: ToastProperties['type'],
  isSuccess: boolean
): React.ReactNode => {
  if (isSuccess) {
    return (
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
        className="h-4 w-4 text-emerald-600"
      >
        <path d="M21.801 10A10 10 0 1 1 17 3.335" />
        <path d="m9 11 3 3L22 4" />
      </svg>
    );
  }
  if (type === 'warning') {
    return (
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
        className="h-4 w-4 text-amber-600"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }
  return (
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
      className="h-4 w-4 text-red-600"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
};

export function toast({
  message,
  description,
  type = 'success',
  duration = Infinity,
  actionLabel,
  onAction,
  onClose,
}: ToastProperties) {
  tt.custom(
    t => {
      const isSuccess = type === 'success';

      const copyToClipboard = () => {
        const text = description ? `${message}\n${description}` : message;
        navigator.clipboard.writeText(text);
      };

      return (
        <div
          className={`${t.visible ? 'animate-custom-enter' : 'animate-custom-leave'} pointer-events-auto w-full max-w-125 overflow-hidden rounded-xl border border-gray-100/50 bg-white/95 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-300`}
        >
          <div className={`h-1 w-full ${getIndicatorClass(type, isSuccess)}`} />

          <div className="p-3">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getIconWrapperClass(type, isSuccess)}`}
              >
                {getIcon(type, isSuccess)}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p className="block cursor-pointer text-sm leading-relaxed font-semibold text-gray-900 transition-colors select-none hover:text-gray-700">
                  {message}
                </p>
                {description && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="mt-1.5 block cursor-pointer text-left text-sm leading-[130%] font-medium whitespace-pre-line text-gray-600 transition-colors select-none hover:text-gray-800"
                  >
                    {description}
                  </button>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
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
                      className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                      title={actionLabel}
                    >
                      {actionLabel}
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  tt.dismiss(t.id, t.toasterId);
                  onClose?.();
                }}
                className="-mt-1 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
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
