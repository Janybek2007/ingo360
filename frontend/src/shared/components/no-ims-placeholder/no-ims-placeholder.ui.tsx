import React from 'react';

import { NO_IMS_PLACEHOLDER_MESSAGE } from '#/shared/constants/ims';
import { cn } from '#/shared/utils/cn';

interface NoImsPlaceholderProps {
  message?: string;
  className?: string;
}

export const NoImsPlaceholder: React.FC<NoImsPlaceholderProps> = React.memo(
  ({ message = NO_IMS_PLACEHOLDER_MESSAGE, className }) => (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl',
        'bg-slate-50 border border-slate-200/80',
        'text-slate-700',
        className
      )}
      role="status"
      aria-label={message}
    >
      <div
        className="flex items-center justify-center size-14 rounded-full bg-indigo-100 text-indigo-600 mb-4"
        aria-hidden
      >
        <svg
          className="size-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
          />
        </svg>
      </div>
      <p className="text-base font-medium max-w-md leading-relaxed">
        {message}
      </p>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        Заполните название IMS и бренды в настройках компании, чтобы видеть
        отчёты и рейтинги.
      </p>
    </div>
  )
);

NoImsPlaceholder.displayName = 'NoImsPlaceholder';
