import React from 'react';

import {
  LoadingIcon,
  LucideAlertCircleIcon,
  LucideRefreshCcwIcon,
} from '../../assets/icons';
import type { IAsyncBoundaryProps as IAsyncBoundaryProperties } from './async-boundry.types';

export const AsyncBoundary: React.FC<IAsyncBoundaryProperties> = ({
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

AsyncBoundary.displayName = '_AsyncBoundary_';

const DefaultFallback = React.memo(() => (
  <div className="my-40 flex w-full animate-pulse flex-col items-center justify-center text-gray-500">
    <LoadingIcon className="size-[32px] animate-spin" />
    <p className="text-sm font-medium">Загрузка данных...</p>
  </div>
));

const DefaultError = React.memo(
  ({
    queryError,
    onRetry,
  }: {
    queryError?: unknown;
    onRetry?: VoidFunction;
  }) => (
    <div className="my-10 flex flex-col items-center justify-center space-y-3 px-4 text-center text-red-600">
      <LucideAlertCircleIcon className="size-[40px] text-red-500" />
      <p className="text-lg font-semibold">Произошла ошибка</p>
      <p className="max-w-sm text-sm text-red-500">
        {(queryError as Error)?.message ?? 'Неизвестная ошибка'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="group mt-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
        >
          <LucideRefreshCcwIcon className="size-[18px] transition-transform duration-200 group-hover:rotate-180" />
          Повторить
        </button>
      )}
    </div>
  )
);

DefaultFallback.displayName = '_DefaultFallback_';
DefaultError.displayName = '_DefaultError_';
