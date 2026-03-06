import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '#/shared/utils/cn';

import { Modal } from '../ui/modal';
import type { IConfirmModalProps as IConfirmModalProperties } from './confirm-modal.types';

export const ConfirmModal: React.FC<IConfirmModalProperties> = React.memo(
  ({
    title,
    message,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    children,
    onConfirm,
    onCancel,
    onClose,
    confirmAs = 'primary',
    disabled = false,
  }) => {
    const handleConfirm = React.useCallback(() => {
      onConfirm();
    }, [onConfirm]);

    const handleCancel = React.useCallback(() => {
      onCancel?.();
      onClose();
    }, [onCancel, onClose]);

    const confirmButtonClassName = React.useMemo(() => {
      const baseClasses =
        'md:px-5 px-4 md:py-2 py-1 text-sm font-medium text-white rounded-lg transition-colors duration-150';

      if (confirmAs === 'danger') {
        return `${baseClasses} bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-sm shadow-rose-200`;
      }

      return `${baseClasses} bg-blue-500 hover:bg-blue-600 active:bg-blue-700 shadow-sm shadow-blue-200`;
    }, [confirmAs]);

    return createPortal(
      <Modal
        title={title}
        onClose={handleCancel}
        classNames={{
          body: 'md:min-w-[32rem] md:max-w-[32rem] min-w-[90dvw] max-w-[90dvw] md:p-6 p-5',
        }}
      >
        <div className="pb-1 md:pb-2">
          {message && (
            <p className="text-[0.938rem] leading-relaxed text-gray-600">
              {message}
            </p>
          )}
          {children && <div className="mt-3 md:mt-4">{children}</div>}
        </div>

        <div className="mt-4 flex justify-end gap-3 md:mt-6">
          <button
            className={cn(
              'rounded-lg border border-gray-200 bg-white px-4 py-1 text-sm font-medium text-gray-600 md:px-5 md:py-2',
              'transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
            )}
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button
            className={cn(
              confirmButtonClassName,
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => !disabled && handleConfirm()}
          >
            {confirmText}
          </button>
        </div>
      </Modal>,
      document.body
    );
  }
);

ConfirmModal.displayName = '_ConfirmModal_';
