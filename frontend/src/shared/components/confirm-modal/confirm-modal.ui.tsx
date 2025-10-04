import React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '#/shared/utils/cn';

import { Modal } from '../ui/modal';
import type { IConfirmModalProps } from './confirm-modal.types';

export const ConfirmModal: React.FC<IConfirmModalProps> = React.memo(
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
        'px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-150';

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
          body: 'min-w-[480px] max-w-[480px]',
        }}
      >
        <div className="pb-2">
          {message && (
            <p className="text-gray-600 text-[15px] leading-relaxed">
              {message}
            </p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            className={cn(
              'px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg',
              'hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-all duration-150'
            )}
            onClick={handleCancel}
          >
            {cancelText}
          </button>
          <button
            className={cn(
              confirmButtonClassName,
              disabled && 'opacity-50 cursor-not-allowed'
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
