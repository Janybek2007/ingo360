import React from 'react';

import {
  LoadingTwotoneLoopIcon,
  LucideAlertCircleIcon,
  LucideRefreshCcwIcon,
} from '../icons';
import type { IAsyncBoundaryProps } from './async-boundry.types';

export const AsyncBoundary: React.FC<IAsyncBoundaryProps> = ({
  children,
  fallback = <DefaultFallback />,
  error,
  boundary,
  isLoading = false,
  queryError,
  onRetry,
}) => {
  if (isLoading) {
    return <>{fallback}</>;
  }

  if (queryError) {
    if (boundary) return <>{boundary}</>;
    if (error) return <>{error}</>;
    return <DefaultError queryError={queryError} onRetry={onRetry} />;
  }

  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};

AsyncBoundary.displayName = 'AsyncBoundary';

const DefaultFallback = () => (
  <div className="flex flex-col items-center justify-center py-10 text-gray-500 animate-pulse">
    <LoadingTwotoneLoopIcon className="animate-spin size-[32px]" />
    <p className="text-sm font-medium">Загрузка данных...</p>
  </div>
);

const DefaultError = ({
  queryError,
  onRetry,
}: {
  queryError?: unknown;
  onRetry?: VoidFunction;
}) => (
  <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-red-600 space-y-3">
    <LucideAlertCircleIcon className="text-red-500 size-[40px]" />
    <p className="font-semibold text-lg">Произошла ошибка</p>
    <p className="text-sm text-red-500 max-w-sm">
      {(queryError as Error)?.message ?? 'Неизвестная ошибка'}
    </p>

    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm"
      >
        <LucideRefreshCcwIcon className="size-[18px] transition-transform duration-200 group-hover:rotate-180" />
        Повторить
      </button>
    )}
  </div>
);
